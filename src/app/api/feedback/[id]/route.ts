import { NextRequest, NextResponse as NRes } from 'next/server'
import prisma from '@/lib/prisma'

type Params = { params: { id: string } }

export async function GET(req: NextRequest, { params }: Params) {
  const { id } = await params
  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = 10

  const comments = await prisma.comment.findMany({
    where: { memoId: parseInt(id) },
    skip: (page - 1) * limit,
    take: 10,
    include: { user: true },
    orderBy: { createdAt: 'desc' },
  })

  const totalCount = await prisma.comment.count()
  return NRes.json({
    comments,
    totalPages: Math.ceil(totalCount / limit),
    currentPage: page,
  })
}
