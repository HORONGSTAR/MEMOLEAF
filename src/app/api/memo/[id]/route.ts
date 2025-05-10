import { NextRequest, NextResponse as NRes } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const { id } = await params
  const memo = await prisma.memo.findUnique({
    where: { id: parseInt(id) },
    include: { user: true, images: true, decos: true },
  })
  return NRes.json({ memo })
}
