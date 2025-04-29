import { NextRequest, NextResponse as NRes } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = 10

  const memos = await prisma.memo.findMany({
    skip: (page - 1) * limit,
    take: 10,
    orderBy: { createdAt: 'desc' },
    include: { user: true, images: true },
  })

  const totalCount = await prisma.user.count()

  return NRes.json({
    memos,
    totalPages: Math.ceil(totalCount / limit),
    currentPage: page,
  })
}

export async function POST(req: NextRequest) {
  try {
    const { userId, content, images } = await req.json()
    const newMemo = await prisma.memo.create({ data: { userId, content } })
    const res = { ...newMemo, images }
    if (images.length > 0) {
      await prisma.image.createMany({
        data: images.map((image: string) => ({ url: image, memoId: newMemo.id })),
      })
      res.images = await prisma.image.findMany({ where: { memoId: newMemo.id } })
    }

    return NRes.json(res)
  } catch (err) {
    console.error(err)
    return NRes.json({ success: false, message: '게시글 등록 중 문제가 발생했습니다.' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, content } = await req.json()
    const memo = await prisma.memo.findUnique({ where: { id } })
    if (memo) {
      const result = await prisma.memo.update({ where: { id }, data: { content } })
      return NRes.json(result)
    } else {
      return NRes.json({ error: '게시글을 찾을 수 없습니다.' }, { status: 404 })
    }
  } catch (err) {
    console.error(err)
    return NRes.json({ success: false, message: '게시글 수정 중 문제가 발생했습니다.' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json()
    const memo = await prisma.memo.findUnique({ where: { id } })
    if (memo) {
      await prisma.memo.delete({ where: { id } })
      return NRes.json({ id })
    } else {
      return NRes.json({ error: '게시글을 찾을 수 없습니다.' }, { status: 404 })
    }
  } catch (err) {
    console.error(err)
    return NRes.json({ success: false, message: '게시글 삭제 중 문제가 발생했습니다.' }, { status: 500 })
  }
}
