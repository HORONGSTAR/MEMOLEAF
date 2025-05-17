import prisma from '@/lib/prisma'
import { NextRequest, NextResponse as NRes } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NRes.json({ error: '로그인이 필요합니다.' }, { status: 401 })

    const id = session.user.id
    const { name, info, image } = await req.json()
    const result = await prisma.user.update({ where: { id }, data: { name, info, image } })
    return NRes.json(result)
  } catch (err) {
    console.error(err)
    return NRes.json({ success: false, message: '프로필 수정 중 문제가 발생했습니다.' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NRes.json({ error: '로그인이 필요합니다.' }, { status: 401 })

    const fromUserId = session.user.id
    const { toUserId } = await req.json()
    const user = await prisma.user.findUnique({ where: { id: toUserId } })
    if (!user) return NRes.json({ error: '유저 정보를 찾을 수 없습니다.' }, { status: 404 })

    const followId = await prisma.follow.create({ data: { fromUserId, toUserId } })
    return NRes.json(followId)
  } catch (err) {
    console.error(err)
    return NRes.json({ success: false, message: '팔로우 중 문제가 발생했습니다.' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NRes.json({ error: '로그인이 필요합니다.' }, { status: 401 })

    const fromUserId = session.user.id
    const { toUserId } = await req.json()
    const user = await prisma.user.findUnique({ where: { id: toUserId } })
    if (!user) return NRes.json({ error: '유저 정보를 찾을 수 없습니다.' }, { status: 404 })

    await prisma.follow.delete({
      where: { toUserId_fromUserId: { toUserId, fromUserId } },
    })
    return NRes.json(toUserId)
  } catch (err) {
    console.error(err)
    return NRes.json({ success: false, message: '팔로우 중 문제가 발생했습니다.' }, { status: 500 })
  }
}
