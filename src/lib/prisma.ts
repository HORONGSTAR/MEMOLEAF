import { PrismaClient, Prisma } from '@prisma/client'

interface CustomNodeJsGlobal {
  prisma: PrismaClient
  prismaConnections: { [key: string]: number }
}

declare const global: CustomNodeJsGlobal

// 환경에 따른 Prisma 설정
const getPrismaOptions = (): Prisma.PrismaClientOptions => {
  // 개발 환경에서는 쿼리 로깅, 배포 환경에서는 에러만 로깅
  const isProduction = process.env.NODE_ENV === 'production'
  console.log('NODE_ENV :', process.env.NODE_ENV)

  // 로그 옵션 설정 - 타입 문제로 인해 기본 설정만 사용
  return {
    // 배포 환경에서는 데이터소스 설정 추가
    ...(isProduction && {
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    }),
  }
}

// 연결 풀 관리를 위한 설정
export const prismaPoolConfig = {
  max: 20, // 최대 연결 수 증가 (부하에 따라 조정)
  min: 3, // 최소 유지 연결 수 (빠른 초기 응답을 위해)
  idle: 60000, // 유휴 타임아웃을 60초로 증가
  acquire: 30000, // 연결 획득 타임아웃
  retries: 3, // 연결 실패 시 재시도 횟수
}

// 글로벌 연결 수 추적 초기화
if (!global.prismaConnections) {
  global.prismaConnections = {
    active: 0,
    idle: 0,
    max: prismaPoolConfig.max,
  }
}

// Prisma 인스턴스 생성 또는 재사용
const prismaClientSingleton = () => {
  const prisma = new PrismaClient(getPrismaOptions())

  // 미들웨어를 통한 연결 추적 및 관리
  prisma.$use(async (params, next) => {
    // 연결이 최대치에 도달했는지 확인
    if (global.prismaConnections.active >= prismaPoolConfig.max) {
      console.warn(`[DB Pool] 최대 연결 수: ${global.prismaConnections.active}/${prismaPoolConfig.max}`)

      // 대기열 처리 로직 (필요시 구현)
      await new Promise((resolve) => setTimeout(resolve, 500))

      // 연결이 여전히 최대치라면 오류 발생
      if (global.prismaConnections.active >= prismaPoolConfig.max) {
        throw new Error('데이터베이스 연결 풀이 소진되었습니다')
      }
    }

    // 활성 연결 수 증가
    global.prismaConnections.active++

    const startTime = Date.now()
    try {
      // 쿼리 실행
      const result = await next(params)
      const timing = Date.now() - startTime

      if (process.env.NODE_ENV !== 'production') {
        console.log(`Query: ${params.model}.${params.action} took ${timing}ms`)
      }

      return result
    } catch (error) {
      const timing = Date.now() - startTime
      console.error(`Query failed: ${params.model}.${params.action} after ${timing}ms`, error)
      throw error
    } finally {
      // 활성 연결 수 감소
      global.prismaConnections.active--
    }
  })

  // 글로벌 에러 처리
  process.on('uncaughtException', (error) => {
    console.error(`Prisma Error (uncaught): ${error}`)
  })

  return prisma
}

// 개발 환경에서 핫 리로딩 시 여러 인스턴스 생성 방지
if (process.env.NODE_ENV !== 'production') {
  if (!global.prisma) {
    global.prisma = prismaClientSingleton()
  }
}

// 싱글톤 패턴으로 Prisma 인스턴스 관리
const prisma = global.prisma || prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma
}

// 연결 상태 모니터링 함수
export const getConnectionStatus = () => {
  return {
    active: global.prismaConnections.active,
    idle: global.prismaConnections.idle,
    max: global.prismaConnections.max,
    available: global.prismaConnections.max - global.prismaConnections.active,
  }
}

export default prisma

// Prisma 연결 해제 함수
export const disconnectPrisma = async () => {
  try {
    await prisma.$disconnect()

    // 연결 카운터 초기화
    if (global.prismaConnections) {
      global.prismaConnections.active = 0
      global.prismaConnections.idle = 0
    }

    console.log('데이터베이스 연결을 성공적으로 마쳤습니다.')
  } catch (error) {
    console.error(`데이터베이스 연결 중 문제 발생: ${error}`)
    process.exit(1)
  }
}

// 비상 연결 해제 함수 (연결 풀 문제 발생 시)
export const emergencyResetConnections = async () => {
  try {
    console.warn('[DB Pool] 연결풀 문제 발생! 긴급 재설정을 시작합니다.')

    // 기존 연결 종료
    await prisma.$disconnect()

    // 연결 카운터 초기화
    if (global.prismaConnections) {
      global.prismaConnections.active = 0
      global.prismaConnections.idle = 0
    }

    // 잠시 대기 후 새 연결 생성
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // 새 연결 테스트 (간단한 쿼리 실행)
    await prisma.$queryRaw`SELECT 1 as test`

    console.log('[DB Pool] 연결 풀 재설정 완료.')
    return true
  } catch (error) {
    console.error(`[DB Pool] 연결 풀 재설정 실패: ${error}`)
    return false
  }
}

// 연결 타임아웃 처리 함수
export const withConnectionTimeout = async <T>(dbOperation: () => Promise<T>, timeoutMs: number = 5000): Promise<T> => {
  // 타임아웃 Promise 생성
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(new Error(`데이터베이스 작업시간 초과: ${timeoutMs}ms`))
    }, timeoutMs)
  })

  try {
    // 데이터베이스 작업과 타임아웃 중 먼저 완료되는 것 반환
    return await Promise.race([dbOperation(), timeoutPromise])
  } catch (error) {
    // 타임아웃 에러인 경우 연결 풀 상태 로깅
    if ((error as Error).message.includes('timed out')) {
      console.error('[DB Pool] 연결 풀 시간 초과. 현재 상태 :', getConnectionStatus())

      // 연결 풀이 거의 찼다면 비상 재설정 고려
      if (global.prismaConnections.active > prismaPoolConfig.max * 0.9) {
        console.warn('[DB Pool] 연결 풀 사용량이 거의 다 찼습니다. 설정을 검토해주세요. ')
      }
    }
    throw error
  }
}

// Prisma 에러 핸들링 함수
export const handlePrismaError = (error: unknown) => {
  console.error('Database error:', error)

  // Prisma 에러 유형에 따른 처리
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      return { status: 409, message: '중복된 데이터가 존재합니다.' }
    } else if (error.code === 'P2025') {
      return { status: 404, message: '요청한 데이터를 찾을 수 없습니다.' }
    }
  }

  return { status: 500, message: '데이터베이스 오류가 발생했습니다.' }
}
