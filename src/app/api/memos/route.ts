import { NextRequest, NextResponse as NRes } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { decosToJson } from '@/shared/utils/common'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const userId = session?.user.id
    const { searchParams } = new URL(req.url)
    const cursor = parseInt(searchParams.get('cursor') || '0')
    const id = parseInt(searchParams.get('id') || '0')
    const aria = searchParams.get('aria') || 'home'
    const keyword = searchParams.get('keyword')
    const filter = searchParams.get('filter')

    const whereData = {
      home: {},
      thread: { parentId: id, ...(cursor && { id: { gt: cursor } }) },
      mypost: { userId: id },
      bookmark: { bookmarks: { some: { userId: id } } },
      search: { ...(keyword && { content: { contains: keyword } }) },
    }[aria]

    const joinTeble = {
      user: { select: { id: true, name: true, image: true, userNum: true } },
      bookmarks: { where: { userId }, select: { id: true } },
      _count: { select: { comments: true, bookmarks: true, leafs: true } },
    }

    const includeData = {
      home: joinTeble,
      thread: undefined,
      mypost: joinTeble,
      bookmark: joinTeble,
      search: joinTeble,
    }[aria]

    const filterData = {
      all: { parentId: undefined },
      thread: { leafs: { some: {} } },
      images: { images: { some: {} } },
    }[filter || 'all']

    const memolist = await prisma.memo.findMany({
      where: {
        parentId: null,
        ...(cursor && { id: { lt: cursor } }),
        ...filterData,
        ...whereData,
      },
      take: 10,
      orderBy: { createdAt: aria !== 'thread' ? 'desc' : 'asc' },
      include: {
        images: { select: { id: true, url: true, alt: true } },
        decos: { select: { id: true, kind: true, extra: true } },
        ...includeData,
      },
    })

    const searchTotal = await prisma.memo.count({
      where: {
        parentId: null,
        ...whereData,
      },
    })

    const memos = memolist.map((item) => {
      return { ...item, decos: decosToJson(item.decos) }
    })

    const nextCursor = memos[9]?.id || -1

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
    res.decos = decosToJson(await prisma.deco.findMany({ where: { memoId: newMemo.id } }))
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
    res.decos = decosToJson(await prisma.deco.findMany({ where: { memoId: memo.id } }))

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
