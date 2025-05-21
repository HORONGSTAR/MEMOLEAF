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
        ...(cursor && { id: { lt: cursor } }),
      },
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

    const searchTotal = await prisma.memo.count({
      where: {
        parentId: null,
        userId: parseInt(id),
      },
    })
    const nextCursor = memos.length > 0 ? memos.slice(-1)[0].id : 0

    return NRes.json({
      memos,
      searchTotal,
      nextCursor,
    })
  } catch (error) {
    console.error(error)
    const message = '유저 메모 조회 중 문제가 발생했습니다.'
    return NRes.json({ success: false, message }, { status: 500 })
  }
}
