import { NextRequest, NextResponse as NRes } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const comments = await prisma.comment.findMany({
      where: { memoId: parseInt(id) },
      skip: (page - 1) * limit,
      take: limit,
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    })
    const totalCount = await prisma.comment.count({ where: { memoId: parseInt(id) } })
    return NRes.json({
      comments,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    })
  } catch (error) {
    console.error(error)
    const message = '댓글 등록 중 문제가 발생했습니다.'
    return NRes.json({ success: false, message }, { status: 500 })
  }
}
