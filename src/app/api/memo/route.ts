import { NextRequest, NextResponse as NRes } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get('page') || '1')
  const userId = searchParams.get('userId')
  const parentId = searchParams.get('parentId')

  const limit = 10

  const memos = await prisma.memo.findMany({
    where: { parentId: null },
    ...(userId && { where: { userId: parseInt(userId) } }),
    ...(parentId && { where: { parentId: parseInt(parentId) } }),
    skip: (page - 1) * limit,
    take: 10,
    orderBy: { createdAt: 'desc' },
    include: { user: true, images: true, decos: true, _count: { select: { comments: true, bookmarks: true } } },
  })

  const totalCount = await prisma.memo.count()

  return NRes.json({
    memos,
    totalPages: Math.ceil(totalCount / limit),
    currentPage: page,
  })
}

export async function POST(req: NextRequest) {
  try {
    const { id, content, images, decos, parentId } = await req.json()

    const user = await prisma.user.findUnique({ where: { id } })
    if (!user) return NRes.json({ error: '유저 정보를 찾을 수 없습니다.' }, { status: 404 })

    const newMemo = await prisma.memo.create({
      data: {
        userId: user.id,
        content,
        parentId,

        ...(images?.length > 0 && { images: { create: images } }),
        ...(decos?.length > 0 && { decos: { create: decos } }),
      },
    })
    const res = { ...newMemo, user, images, decos }

    res.images = await prisma.image.findMany({ where: { memoId: newMemo.id } })
    res.decos = await prisma.deco.findMany({ where: { memoId: newMemo.id } })

    return NRes.json(res)
  } catch (err) {
    console.error(err)
    return NRes.json({ success: false, message: '메모 등록 중 문제가 발생했습니다.' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, content, images, decos } = await req.json()
    const search = await prisma.memo.findUnique({ where: { id } })
    if (!search) return NRes.json({ error: '메모를 찾을 수 없습니다.' }, { status: 404 })

    const memo = await prisma.memo.update({
      where: { id },
      data: {
        content,
        images: { deleteMany: {}, ...(images?.length > 0 && { create: images }) },
        decos: { deleteMany: {}, ...(decos?.length > 0 && { create: decos }) },
      },
    })

    const res = { ...memo, images, decos }
    res.images = await prisma.image.findMany({ where: { memoId: memo.id } })
    res.decos = await prisma.deco.findMany({ where: { memoId: memo.id } })

    return NRes.json(res)
  } catch (err) {
    console.error(err)
    return NRes.json({ success: false, message: '메모 수정 중 문제가 발생했습니다.' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json()
    const search = await prisma.memo.findUnique({ where: { id } })
    if (search) {
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
