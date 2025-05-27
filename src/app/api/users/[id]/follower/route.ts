import prisma from '@/lib/prisma'
import { NextRequest, NextResponse as NRes } from 'next/server'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { searchParams } = new URL(req.url)
    const cursor = parseInt(searchParams.get('cursor') || '0')

    const whereData = { toUserId: parseInt(id) }
    const selectData = { select: { id: true, name: true, image: true, info: true, userNum: true } }

    const follows = await prisma.follow.findMany({
      where: { fromUserId: { lt: cursor }, ...whereData },
      take: 10,
      orderBy: { fromUserId: 'desc' },
      include: { fromUser: selectData },
    })

    const users = follows.map((follow) => follow.fromUser)
    const nextCursor = users[9]?.id || -1
    const searchTotal = await prisma.follow.count({ where: whereData })
    return NRes.json({
      users,
      searchTotal,
      nextCursor,
    })
  } catch (error) {
    console.error(error)
    const message = '팔로워 목록 조회 중 문제가 발생했습니다.'
    return NRes.json({ success: false, message }, { status: 500 })
  }
}
