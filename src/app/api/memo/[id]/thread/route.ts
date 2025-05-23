import { NextRequest, NextResponse as NRes } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { searchParams } = new URL(req.url)
    const cursor = parseInt(searchParams.get('cursor') || '0')
    const limit = parseInt(searchParams.get('limit') || '10')

    const memos = await prisma.memo.findMany({
      where: {
        parentId: parseInt(id),
        ...(cursor && { id: { gt: cursor } }),
      },
      take: limit,
      orderBy: { id: 'asc' },
      include: {
        images: { select: { id: true, url: true, alt: true } },
        decos: { select: { id: true, kind: true, extra: true } },
      },
    })

    const searchTotal = await prisma.memo.count({
      where: { parentId: parseInt(id) },
    })
    const nextCursor = memos.length > 0 ? memos.slice(-1)[0].id : 0

    return NRes.json({
      memos,
      searchTotal,
      nextCursor,
    })
  } catch (error) {
    console.error(error)
    const message = '타래 조회 중 문제가 발생했습니다.'
    return NRes.json({ success: false, message }, { status: 500 })
  }
}
