import { NextRequest, NextResponse as NRes } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const userId = session?.user.id
    const { searchParams } = new URL(req.url)
    const cursor = parseInt(searchParams.get('cursor') || '0')
    const limit = parseInt(searchParams.get('limit') || '10')
    const keyword = searchParams.get('keyword')

    const memos = await prisma.memo.findMany({
      where: {
        parentId: null,
        id: { lt: cursor },
        ...(keyword && { content: { contains: keyword } }),
      },
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, name: true, image: true, userNum: true } },
        images: { select: { id: true, url: true, alt: true } },
        decos: { select: { id: true, kind: true, extra: true } },
        bookmarks: { where: { userId }, select: { id: true } },
        _count: { select: { comments: true, bookmarks: true, leafs: true } },
      },
    })

    const searchTotal = await prisma.memo.count({
      where: {
        parentId: null,
        ...(keyword && { content: { contains: keyword } }),
      },
    })

    const nextCursor = memos[9]?.id || 0

    return NRes.json({
      memos,
      searchTotal,
      nextCursor,
    })
  } catch (error) {
    console.error(error)
    const message = '메모 목록 조회 중 문제가 발생했습니다.'
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
    const id = session.user.id
    const { content, images, decos, parentId } = await req.json()
    const newMemo = await prisma.memo.create({
      data: {
        userId: id,
        content,
        parentId,

        ...(images?.length > 0 && { images: { create: images } }),
        ...(decos?.length > 0 && { decos: { create: decos } }),
      },
    })
    const res = { ...newMemo, images, decos }
    res.images = await prisma.image.findMany({ where: { memoId: newMemo.id } })
    res.decos = await prisma.deco.findMany({ where: { memoId: newMemo.id } })

    return NRes.json(res)
  } catch (error) {
    console.error(error)
    const message = '메모 등록 중 문제가 발생했습니다.'
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
    const { id, content, images, decos } = await req.json()
    const search = await prisma.memo.count({ where: { id } })
    if (!search) {
      const message = '메모를 찾을 수 없습니다.'
      return NRes.json({ success: false, message }, { status: 404 })
    }
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
  } catch (error) {
    console.error(error)
    return NRes.json({ success: false, message: '메모 수정 중 문제가 발생했습니다.' }, { status: 500 })
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
    const search = await prisma.memo.count({ where: { id } })
    if (!search) {
      const message = '메모를 찾을 수 없습니다.'
      return NRes.json({ success: false, message }, { status: 404 })
    }
    await prisma.memo.delete({ where: { id } })
    return NRes.json({ id })
  } catch (error) {
    console.error(error)
    const message = '메모 삭제 중 문제가 발생했습니다.'
    return NRes.json({ success: false, message }, { status: 500 })
  }
}
