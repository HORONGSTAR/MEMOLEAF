import { NextRequest, NextResponse as NRes } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { id, text, userId } = await req.json()
    const memo = await prisma.memo.findUnique({ where: { id } })
    if (!memo) return NRes.json({ error: '메모를 찾을 수 없습니다.' }, { status: 404 })

    const newComment = await prisma.comment.create({
      data: { memoId: memo.id, userId, text },
    })

    return NRes.json(newComment)
  } catch (err) {
    console.error(err)
    return NRes.json({ success: false, message: '댓글 등록 중 문제가 발생했습니다.' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, text } = await req.json()
    const search = await prisma.comment.findUnique({ where: { id } })
    if (!search) return NRes.json({ error: '댓글을 찾을 수 없습니다.' }, { status: 404 })

    const comment = await prisma.comment.update({ where: { id }, data: { text } })

    return NRes.json(comment)
  } catch (err) {
    console.error(err)
    return NRes.json({ success: false, message: '댓글 수정 중 문제가 발생했습니다.' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json()
    const search = await prisma.comment.findUnique({ where: { id } })
    if (search) {
      await prisma.comment.delete({ where: { id } })
      return NRes.json({ id })
    } else {
      return NRes.json({ error: '댓글을 찾을 수 없습니다.' }, { status: 404 })
    }
  } catch (err) {
    console.error(err)
    return NRes.json({ success: false, message: '메모 삭제 중 문제가 발생했습니다.' }, { status: 500 })
  }
}
