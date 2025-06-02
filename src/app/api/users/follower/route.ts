import prisma from '@/lib/prisma'
import { FollowerWithRelations } from '@/shared/types/get'
import { NextRequest, NextResponse as NRes } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const cursor = parseInt(searchParams.get('cursor') || '0')
    const id = parseInt(searchParams.get('id') || '0')

    const whereData = { followingId: id }

    const follows = await prisma.follow.findMany({
      where: { ...(cursor && { followerId: { lt: cursor } }), ...whereData },
      take: 10,
      orderBy: { followerId: 'desc' },
      include: {
        follower: { select: { id: true, name: true, image: true, info: true, userNum: true } },
      },
    })

    const users = (follows as FollowerWithRelations[]).map((follow) => follow.follower)
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
