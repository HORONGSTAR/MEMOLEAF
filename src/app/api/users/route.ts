import prisma from '@/lib/prisma'
import { NextRequest, NextResponse as NRes } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

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

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      const message = '로그인이 필요합니다.'
      return NRes.json({ success: false, message }, { status: 401 })
    }

    const id = session.user.id
    const { name, info, image } = await req.json()
    const result = await prisma.user.update({ where: { id }, data: { name, info, image } })
    return NRes.json(result)
  } catch (err) {
    console.error(err)
    return NRes.json({ success: false, message: '프로필 수정 중 문제가 발생했습니다.' }, { status: 500 })
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
