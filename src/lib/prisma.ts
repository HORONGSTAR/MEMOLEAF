import { PrismaClient, Prisma } from '@prisma/client'

interface CustomNodeJsGlobal {
  prisma: PrismaClient
}

declare const global: CustomNodeJsGlobal

// 환경에 따른 Prisma 설정
const getPrismaOptions = (): Prisma.PrismaClientOptions => {
  // 개발 환경에서는 쿼리 로깅, 배포 환경에서는 에러만 로깅
  const isProduction = process.env.NODE_ENV === 'production'

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

// 연결 풀 관리를 위한 설정 (필요시 사용)
export const prismaPoolConfig = {
  max: 5, // 최대 연결 수
  min: 1, // 최소 연결 수
  idle: 10000, // 유휴 타임아웃(ms)
}

// Prisma 인스턴스 생성 또는 재사용
const prismaClientSingleton = () => {
  const prisma = new PrismaClient(getPrismaOptions())

  // 이벤트 핸들러 설정 (로그 기록)
  // 타입 안전한 이벤트 핸들러 설정
  prisma.$use(async (params, next) => {
    const startTime = Date.now()
    const result = await next(params)
    const timing = Date.now() - startTime

    if (process.env.NODE_ENV !== 'production') {
      console.log(`Query: ${params.model}.${params.action} took ${timing}ms`)
    }

    return result
  })

  // 글로벌 에러 처리
  process.on('uncaughtException', (error) => {
    console.error('Prisma Error (uncaught):', error)
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

export default prisma

// Prisma 연결 해제 함수
export const disconnectPrisma = async () => {
  try {
    await prisma.$disconnect()
    console.log('Database connection closed successfully')
  } catch (error) {
    console.error('Error disconnecting from database:', error)
    process.exit(1)
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
