import { NextRequest, NextResponse as NRes } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const userId = session?.user.id
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const keyword = searchParams.get('keyword')

    const whereData = {
      where: {
        parentId: null,
        content: keyword ? { contains: keyword } : undefined,
      },
    }

    const memos = await prisma.memo.findMany({
      ...whereData,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: true,
        images: true,
        decos: true,
        bookmarks: { where: { userId } },
        _count: { select: { comments: true, bookmarks: true, leafs: true } },
      },
    })
    const totalCount = await prisma.memo.count({ ...whereData })
    return NRes.json({
      memos,
      total: totalCount,
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
    const res = { ...newMemo, images, decos, _count: { leafs: 0, comments: 0, bookmarks: 0 } }
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
