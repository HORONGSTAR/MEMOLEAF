import { NextRequest, NextResponse as NRes } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const memo = await prisma.memo.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: true,
        images: true,
        decos: true,
        bookmarks: true,
        _count: { select: { comments: true, bookmarks: true, leafs: true } },
      },
    })
    if (!memo) {
      const message = '메모를 찾을 수 없습니다.'
      return NRes.json({ success: false, message }, { status: 404 })
    }
    return NRes.json({ memo })
  } catch (error) {
    console.error(error)
    const message = '메모 조회 중 문제가 발생했습니다.'
    return NRes.json({ success: false, message }, { status: 500 })
  }
}
