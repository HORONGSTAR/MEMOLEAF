import { NextRequest, NextResponse as NRes } from 'next/server'
import prisma from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    const userId = session?.user.id
    const { id } = await params
    const { searchParams } = new URL(req.url)
    const cursor = parseInt(searchParams.get('cursor') || '0')
    const limit = parseInt(searchParams.get('limit') || '10')

    const memos = await prisma.memo.findMany({
      where: {
        parentId: null,
        userId: parseInt(id),
        id: { lt: cursor },
      },
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, name: true, image: true } },
        images: { select: { id: true, url: true, alt: true } },
        decos: { select: { id: true, kind: true, extra: true } },
        bookmarks: { where: { userId }, select: { id: true } },
        _count: { select: { comments: true, bookmarks: true, leafs: true } },
      },
    })

    const nextCursor = memos[9]?.id || 0

    return NRes.json({
      memos,
      nextCursor,
    })
  } catch (error) {
    console.error(error)
    const message = '유저 메모 조회 중 문제가 발생했습니다.'
    return NRes.json({ success: false, message }, { status: 500 })
  }
}
