import prisma from '@/lib/prisma'
import { NextRequest, NextResponse as NRes } from 'next/server'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const whereData = { where: { fromUserId: parseInt(id) } }
    const selectData = { select: { id: true, name: true, image: true, info: true, userNum: true } }

    const follows = await prisma.follow.findMany({
      ...whereData,
      skip: (page - 1) * limit,
      take: limit,
      include: { toUser: selectData },
    })

    const users = follows.map((follow) => follow.toUser)
    const totalCount = await prisma.follow.count({ ...whereData })
    return NRes.json({
      users,
      total: totalCount,
    })
  } catch (error) {
    console.error(error)
    const message = '팔로워 목록 조회 중 문제가 발생했습니다.'
    return NRes.json({ success: false, message }, { status: 500 })
  }
}
