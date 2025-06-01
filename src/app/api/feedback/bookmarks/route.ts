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
    const newBookmark = await prisma.bookMark.create({
      data: { memoId: id, userId },
    })

    return NRes.json(newBookmark.id)
  } catch (error) {
    console.error(error)
    const message = '북마크 등록 중 문제가 발생했습니다.'
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
    const search = await prisma.bookMark.findUnique({ where: { id } })
    if (!search) {
      const message = '등록한 북마크를 찾을 수 없습니다.'
      return NRes.json({ success: false, message }, { status: 404 })
    }
    await prisma.bookMark.delete({ where: { id } })
    return NRes.json(search.memoId)
  } catch (error) {
    console.error(error)
    const message = '북마크 취소 중 문제가 발생했습니다.'
    return NRes.json({ success: false, message }, { status: 500 })
  }
}
