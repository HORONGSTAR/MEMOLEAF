import { NextRequest, NextResponse as NRes } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const memo = await prisma.memo.findUnique({
    where: { id: parseInt(id) },
    include: {
      user: true,
      images: true,
      decos: true,
      _count: { select: { comments: true, bookmarks: true, leafs: true } },
    },
  })
  return NRes.json({ memo })
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { parentId } = await req.json()

  await prisma.memo.update({
    where: { id: parseInt(id) },
    data: { parentId },
  })
  return NRes.json({ id })
}
