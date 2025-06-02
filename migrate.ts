// migrate.ts
import { PrismaClient } from '@prisma/client'

// 기존 Supabase 연결
const supabasePrisma = new PrismaClient({
  datasourceUrl: process.env.SUPABASE_DATABASE_URL,
})

// 새로운 Prisma Postgres 연결
const prismaPostgres = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
})

async function migrateData() {
  try {
    console.log('🚀 마이그레이션 시작...')

    // 1. 사용자 데이터 마이그레이션
    console.log('👤 사용자 데이터 마이그레이션 중...')
    const users = await supabasePrisma.user.findMany()
    console.log(`${users.length}명의 사용자 발견`)

    for (const user of users) {
      try {
        await prismaPostgres.user.upsert({
          where: { id: user.id },
          update: {},
          create: {
            id: user.id,
            userNum: user.userNum,
            credit: user.credit,
            name: user.name,
            info: user.info,
            note: user.note,
            image: user.image,
            cover: user.cover,
            createdAt: user.createdAt,
          },
        })
      } catch (error) {
        console.error(`사용자 ${user.id} 마이그레이션 실패:`, error)
        throw error
      }
    }
    console.log('✅ 사용자 데이터 마이그레이션 완료')

    // 2. 팔로우 데이터 마이그레이션
    console.log('👥 팔로우 데이터 마이그레이션 중...')
    const follows = await supabasePrisma.follow.findMany()
    console.log(`${follows.length}개의 팔로우 관계 발견`)

    for (const follow of follows) {
      try {
        await prismaPostgres.follow.upsert({
          where: {
            followerId_followingId: {
              followerId: follow.followerId,
              followingId: follow.followingId,
            },
          },
          update: {},
          create: {
            followerId: follow.followerId,
            followingId: follow.followingId,
          },
        })
      } catch (error) {
        console.error(`팔로우 관계 ${follow.followerId}->${follow.followingId} 마이그레이션 실패:`, error)
        throw error
      }
    }
    console.log('✅ 팔로우 데이터 마이그레이션 완료')

    // 3. 메모 데이터 마이그레이션
    console.log('📝 메모 데이터 마이그레이션 중...')
    const memos = await supabasePrisma.memo.findMany({
      orderBy: { id: 'asc' },
    })
    console.log(`${memos.length}개의 메모 발견`)

    for (const memo of memos) {
      try {
        await prismaPostgres.memo.upsert({
          where: { id: memo.id },
          update: {},
          create: {
            id: memo.id,
            content: memo.content,
            titleId: memo.titleId,
            userId: memo.userId,
            createdAt: memo.createdAt,
            updatedAt: memo.updatedAt,
          },
        })
      } catch (error) {
        console.error(`메모 ${memo.id} 마이그레이션 실패:`, error)
        throw error
      }
    }
    console.log('✅ 메모 데이터 마이그레이션 완료')

    // 4. 데코 데이터 마이그레이션
    console.log('🎨 데코 데이터 마이그레이션 중...')
    const decos = await supabasePrisma.deco.findMany()
    console.log(`${decos.length}개의 데코 발견`)

    for (const deco of decos) {
      try {
        await prismaPostgres.deco.upsert({
          where: { id: deco.id },
          update: {},
          create: {
            id: deco.id,
            kind: deco.kind,
            extra: deco.extra,
            memoId: deco.memoId,
          },
        })
      } catch (error) {
        console.error(`데코 ${deco.id} 마이그레이션 실패:`, error)
        throw error
      }
    }
    console.log('✅ 데코 데이터 마이그레이션 완료')

    // 5. 이미지 데이터 마이그레이션
    console.log('🖼️ 이미지 데이터 마이그레이션 중...')
    const images = await supabasePrisma.image.findMany()
    console.log(`${images.length}개의 이미지 발견`)

    for (const image of images) {
      try {
        await prismaPostgres.image.upsert({
          where: { id: image.id },
          update: {},
          create: {
            id: image.id,
            url: image.url,
            alt: image.alt,
            memoId: image.memoId,
            createdAt: image.createdAt,
          },
        })
      } catch (error) {
        console.error(`이미지 ${image.id} 마이그레이션 실패:`, error)
        throw error
      }
    }
    console.log('✅ 이미지 데이터 마이그레이션 완료')

    // 6. 즐겨찾기 데이터 마이그레이션
    console.log('⭐ 즐겨찾기 데이터 마이그레이션 중...')
    const favorites = await supabasePrisma.favorite.findMany()
    console.log(`${favorites.length}개의 즐겨찾기 발견`)

    for (const favorite of favorites) {
      try {
        await prismaPostgres.favorite.upsert({
          where: { id: favorite.id },
          update: {},
          create: {
            id: favorite.id,
            userId: favorite.userId,
            memoId: favorite.memoId,
            createdAt: favorite.createdAt,
          },
        })
      } catch (error) {
        console.error(`즐겨찾기 ${favorite.id} 마이그레이션 실패:`, error)
        throw error
      }
    }
    console.log('✅ 즐겨찾기 데이터 마이그레이션 완료')

    // 7. 북마크 데이터 마이그레이션
    console.log('🔖 북마크 데이터 마이그레이션 중...')
    const bookmarks = await supabasePrisma.bookMark.findMany()
    console.log(`${bookmarks.length}개의 북마크 발견`)

    for (const bookmark of bookmarks) {
      try {
        await prismaPostgres.bookMark.upsert({
          where: { id: bookmark.id },
          update: {},
          create: {
            id: bookmark.id,
            userId: bookmark.userId,
            memoId: bookmark.memoId,
            createdAt: bookmark.createdAt,
          },
        })
      } catch (error) {
        console.error(`북마크 ${bookmark.id} 마이그레이션 실패:`, error)
        throw error
      }
    }
    console.log('✅ 북마크 데이터 마이그레이션 완료')

    // 8. 알림 데이터 마이그레이션
    console.log('🔔 알림 데이터 마이그레이션 중...')
    const notifications = await supabasePrisma.notification.findMany()
    console.log(`${notifications.length}개의 알림 발견`)

    for (const notification of notifications) {
      try {
        await prismaPostgres.notification.upsert({
          where: { id: notification.id },
          update: {},
          create: {
            id: notification.id,
            aria: notification.aria,
            sanderId: notification.sanderId,
            recipientId: notification.recipientId,
            memoId: notification.memoId,
            createdAt: notification.createdAt,
          },
        })
      } catch (error) {
        console.error(`알림 ${notification.id} 마이그레이션 실패:`, error)
        throw error
      }
    }
    console.log('✅ 알림 데이터 마이그레이션 완료')

    // 9. 시퀀스 재설정 (PostgreSQL에서 중요)
    console.log('🔄 시퀀스 재설정 중...')

    const tables = [
      { name: 'User', column: 'id' },
      { name: 'Memo', column: 'id' },
      { name: 'Deco', column: 'id' },
      { name: 'Image', column: 'id' },
      { name: 'Favorite', column: 'id' },
      { name: 'BookMark', column: 'id' },
      { name: 'Notification', column: 'id' },
    ]

    for (const table of tables) {
      try {
        // 테이블명을 소문자로 변환 (PostgreSQL 표준)
        const tableName = table.name.toLowerCase()

        // 최대 ID 값 조회
        const maxIdResult = (await prismaPostgres.$queryRaw`
          SELECT COALESCE(MAX(id), 0) as max_id FROM ${tableName}
        `) as { max_id: number }[]

        const maxId = maxIdResult[0]?.max_id || 0

        if (maxId > 0) {
          // 시퀀스명 생성 (일반적인 PostgreSQL 명명 규칙)
          const sequenceName = `${tableName}_id_seq`

          await prismaPostgres.$executeRaw`
            SELECT setval(${sequenceName}, ${maxId}, true)
          `
          console.log(`${table.name} 테이블 시퀀스를 ${maxId}로 설정`)
        }
      } catch (error) {
        console.error(`${table.name} 테이블 시퀀스 재설정 실패:`, error)
        // 시퀀스 재설정 실패는 치명적이지 않으므로 계속 진행
      }
    }
    console.log('✅ 시퀀스 재설정 완료')

    console.log('🎉 모든 데이터 마이그레이션이 성공적으로 완료되었습니다!')

    // 마이그레이션 결과 요약 출력
    console.log('\n📊 마이그레이션 결과 요약:')
    console.log(`- 사용자: ${users.length}명`)
    console.log(`- 팔로우: ${follows.length}개`)
    console.log(`- 메모: ${memos.length}개`)
    console.log(`- 데코: ${decos.length}개`)
    console.log(`- 이미지: ${images.length}개`)
    console.log(`- 즐겨찾기: ${favorites.length}개`)
    console.log(`- 북마크: ${bookmarks.length}개`)
    console.log(`- 알림: ${notifications.length}개`)
  } catch (error) {
    console.error('❌ 마이그레이션 오류:', error)
    throw error
  } finally {
    await supabasePrisma.$disconnect()
    await prismaPostgres.$disconnect()
  }
}

// 스크립트 직접 실행
migrateData()
  .then(() => {
    console.log('마이그레이션 완료!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('마이그레이션 실패:', error)
    process.exit(1)
  })

export { migrateData }
