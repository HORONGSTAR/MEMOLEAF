import { NextRequest, NextResponse as NRes } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      const message = '로그인이 필요합니다.'
      return NRes.json({ success: false, message }, { status: 401 })
    }
    const { id } = await req.json()
    const memo = await prisma.memo.findUnique({ where: { id }, select: { userId: true } })

    if (!memo) {
      const message = '메모를 찾을 수 없습니다.'
      return NRes.json({ success: false, message }, { status: 404 })
    }
    const userId = session.user.id
    const newFavorite = await prisma.favorite.create({
      data: { memoId: id, userId },
    })

    if (userId !== memo.userId) {
      await prisma.alarm.create({
        data: { link: id, sanderId: userId, recipientId: memo.userId, aria: 'favorite' },
      })
    }

    return NRes.json(newFavorite.id)
  } catch (error) {
    console.error(error)
    const message = '좋아요 등록 중 문제가 발생했습니다.'
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
    const { id } = await req.json()
    const search = await prisma.favorite.findUnique({ where: { id } })
    if (!search) {
      const message = '좋아요를 찾을 수 없습니다.'
      return NRes.json({ success: false, message }, { status: 404 })
    }
    await prisma.favorite.delete({ where: { id } })
    return NRes.json(search.memoId)
  } catch (error) {
    console.error(error)
    const message = '좋아요 해제 중 문제가 발생했습니다.'
    return NRes.json({ success: false, message }, { status: 500 })
  }
}
