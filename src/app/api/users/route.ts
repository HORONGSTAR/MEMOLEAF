import prisma from '@/lib/prisma'
import { NextRequest, NextResponse as NRes } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const keyword = searchParams.get('keyword')

    const whereData = {
      ...(keyword && {
        where: {
          OR: [{ name: { contains: keyword } }, { userNum: parseInt(keyword) }, { info: { contains: keyword } }],
        },
      }),
    }

    const users = await prisma.user.findMany({
      ...whereData,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    })
    const totalCount = await prisma.user.count({ ...whereData })
    return NRes.json({
      users,
      total: totalCount,
    })
  } catch (error) {
    console.error(error)
    const message = '유저 목록 조회 중 문제가 발생했습니다.'
    return NRes.json({ success: false, message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      const message = '로그인이 필요합니다.'
      return NRes.json({ success: false, message }, { status: 401 })
    }
    const fromUserId = session.user.id
    const { toUserId } = await req.json()
    const search = await prisma.user.count({ where: { id: toUserId } })

    if (!search) {
      const message = '유저를 찾을 수 없습니다.'
      return NRes.json({ success: false, message }, { status: 404 })
    }
    const followId = await prisma.follow.create({ data: { fromUserId, toUserId } })
    const readerId = session.user.id

    if (toUserId !== readerId) {
      await prisma.alarm.create({
        data: { linkId: fromUserId, readerId, authorId: toUserId, aria: 'follow' },
      })
    }

    return NRes.json(followId)
  } catch (error) {
    console.error(error)
    const message = '팔로우 중 문제가 발생했습니다.'
    return NRes.json({ success: false, message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      const message = '로그인이 필요합니다.'
      return NRes.json({ success: false, message }, { status: 401 })
    }
    const fromUserId = session.user.id
    const { toUserId } = await req.json()
    const search = await prisma.user.count({ where: { id: toUserId } })
    if (!search) {
      const message = '유저를 찾을 수 없습니다.'
      return NRes.json({ success: false, message }, { status: 404 })
    }
    await prisma.follow.delete({
      where: { toUserId_fromUserId: { toUserId, fromUserId } },
    })
    return NRes.json(toUserId)
  } catch (error) {
    console.error(error)
    const message = '언팔로우 중 문제가 발생했습니다.'
    return NRes.json({ success: false, message }, { status: 500 })
  }
}
