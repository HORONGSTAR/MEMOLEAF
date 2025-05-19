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
    const { id, text } = await req.json()
    const memo = await prisma.memo.findUnique({ where: { id }, select: { userId: true } })
    if (!memo) {
      const message = '메모를 찾을 수 없습니다.'
      return NRes.json({ success: false, message }, { status: 404 })
    }
    const userId = session.user.id
    const newComment = await prisma.comment.create({
      data: { memoId: id, userId, text },
    })

    await prisma.alarm.create({
      data: { linkId: id, readerId: userId, authorId: memo.userId, aria: 'comment' },
    })

    return NRes.json(newComment)
  } catch (err) {
    console.error(err)
    const message = '댓글 등록 중 문제가 발생했습니다.'
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

    const { id, text } = await req.json()
    const search = await prisma.comment.count({ where: { id } })
    if (!search) {
      const message = '댓글을 찾을 수 없습니다.'
      return NRes.json({ success: false, message }, { status: 404 })
    }

    const comment = await prisma.comment.update({ where: { id }, data: { text } })

    return NRes.json(comment)
  } catch (err) {
    console.error(err)
    const message = '댓글 수정 중 문제가 발생했습니다.'
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
    const search = await prisma.comment.count({ where: { id } })
    if (!search) {
      const message = '댓글을 찾을 수 없습니다.'
      return NRes.json({ success: false, message }, { status: 404 })
    }
    await prisma.comment.delete({ where: { id } })
    return NRes.json({ id })
  } catch (error) {
    console.error(error)
    const message = '댓글 삭제 중 문제가 발생했습니다.'
    return NRes.json({ success: false, message }, { status: 500 })
  }
}
