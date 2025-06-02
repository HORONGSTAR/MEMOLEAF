import prisma from '@/lib/prisma'
import { NextRequest, NextResponse as NRes } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const cursor = searchParams.get('cursor')
    const filter = searchParams.get('filter')
    const keyword = searchParams.get('keyword')

    const whereData = keyword
      ? {
          profile: { OR: [{ name: { contains: keyword } }, { info: { contains: keyword } }] },
          userNum: { userNum: parseInt(keyword) },
        }[filter || 'profile']
      : { favorites: { some: { memoId: parseInt(filter || '0') } } }

    const selectData = { id: true, name: true, image: true, info: true, userNum: true }

    const users = await prisma.user.findMany({
      where: { ...whereData },
      take: 10,
      ...(cursor && {
        cursor: { id: parseInt(cursor) },
        skip: 1,
      }),
      orderBy: { createdAt: 'desc' },
      select: selectData,
    })

    const searchTotal = await prisma.user.count({ where: whereData })
    const nextCursor = users[9]?.id || -1
    return NRes.json({
      users,
      searchTotal,
      nextCursor,
    })
  } catch (error) {
    console.error(error)
    const message = '유저 목록 검색 중 문제가 발생했습니다.'
    return NRes.json({ success: false, message }, { status: 500 })
  }
}
