import { NextRequest, NextResponse as NRes } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { searchParams } = new URL(req.url)
    const cursor = parseInt(searchParams.get('cursor') || '0')
    const limit = parseInt(searchParams.get('limit') || '10')

    const bookmarks = await prisma.bookMark.findMany({
      where: {
        userId: parseInt(id),
        memoId: { lt: cursor },
      },
      take: limit,
      orderBy: { memoId: 'desc' },
      include: {
        memo: {
          include: {
            user: true,
            images: true,
            decos: true,
            _count: { select: { comments: true, bookmarks: true, leafs: true } },
          },
        },
      },
    })

    const memos = bookmarks.map((bookmark) => ({ ...bookmark.memo, bookmarks: [{ id: bookmark.id }] }))

    const nextCursor = memos[9]?.id || 0

    return NRes.json({
      memos,
      nextCursor,
    })
  } catch (error) {
    console.error(error)
    const message = '북마크 조회 중 문제가 발생했습니다.'
    return NRes.json({ success: false, message }, { status: 500 })
  }
}
