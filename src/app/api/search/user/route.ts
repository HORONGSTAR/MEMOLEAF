import prisma from '@/lib/prisma'
import { NextRequest, NextResponse as NRes } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const cursor = parseInt(searchParams.get('cursor') || '0')
    const keyword = searchParams.get('keyword')

    const whereData = {
      ...(keyword && {
        where: {
          id: { lt: cursor },
          OR: [{ name: { contains: keyword } }, { userNum: parseInt(keyword) }, { info: { contains: keyword } }],
        },
      }),
    }

    const users = await prisma.user.findMany({
      ...whereData,
      take: 10,
      orderBy: { createdAt: 'desc' },
    })
    const searchTotal = await prisma.user.count({ ...whereData })
    const nextCursor = users[9]?.id || -1

    return NRes.json({
      users,
      searchTotal,
      nextCursor,
    })
  } catch (error) {
    console.error(error)
    const message = '유저 목록 조회 중 문제가 발생했습니다.'
    return NRes.json({ success: false, message }, { status: 500 })
  }
}
