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
    const { id, content, images } = await req.json()
    const user = await prisma.user.findUnique({ where: { id } })
    if (!user) return NRes.json({ error: '유저 정보를 찾을 수 없습니다.' }, { status: 404 })

    const newMemo = await prisma.memo.create({ data: { userId: user.id, content } })
    const res = { ...newMemo, user, images }

    if (images.length > 0) {
      await prisma.image.createMany({
        data: images.map((image: string) => ({ url: image, memoId: newMemo.id })),
      })
    }

    res.images = await prisma.image.findMany({ where: { memoId: newMemo.id } })

    return NRes.json(res)
  } catch (err) {
    console.error(err)
    return NRes.json({ success: false, message: '메모 등록 중 문제가 발생했습니다.' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, content, images, rmImgs } = await req.json()
    const search = await prisma.memo.findUnique({ where: { id } })
    if (!search) return NRes.json({ error: '메모를 찾을 수 없습니다.' }, { status: 404 })

    const memo = await prisma.memo.update({ where: { id }, data: { content } })
    const res = { ...memo, images }

    if (images.length > 0) {
      await prisma.image.createMany({
        data: images.map((image: string) => ({ url: image, memoId: id })),
      })
    }

    for (const id of rmImgs) await prisma.image.delete({ where: { id } })

    res.images = await prisma.image.findMany({ where: { memoId: memo.id } })
    return NRes.json(res)
  } catch (err) {
    console.error(err)
    return NRes.json({ success: false, message: '메모 수정 중 문제가 발생했습니다.' }, { status: 500 })
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
      return NRes.json({ error: '메모를 찾을 수 없습니다.' }, { status: 404 })
    }
  } catch (err) {
    console.error(err)
    return NRes.json({ success: false, message: '메모 삭제 중 문제가 발생했습니다.' }, { status: 500 })
  }
}
