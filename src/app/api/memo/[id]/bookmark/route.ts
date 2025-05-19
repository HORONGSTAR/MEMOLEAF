import { NextRequest, NextResponse as NRes } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const whereData = {
      where: { userId: parseInt(id) },
    }
    const bookmarks = await prisma.bookMark.findMany({
      ...whereData,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        memo: {
          include: {
            user: true,
            images: true,
            decos: true,
            bookmarks: true,
            _count: { select: { comments: true, bookmarks: true, leafs: true } },
          },
        },
      },
    })

    const memos = bookmarks.map((bookmark) => bookmark.memo)
    const totalCount = await prisma.bookMark.count({ ...whereData })
    return NRes.json({
      memos,
      total: totalCount,
    })
  } catch (error) {
    console.error(error)
    const message = '북마크 조회 중 문제가 발생했습니다.'
    return NRes.json({ success: false, message }, { status: 500 })
  }
}
