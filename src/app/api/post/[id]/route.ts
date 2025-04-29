import { NextRequest, NextResponse as NRes } from 'next/server'
import prisma from '@/lib/prisma'

type Params = {
  params: { id: string }
}

export async function GET(req: NextRequest, { params }: Params) {
  const { id } = params
  const memo = await prisma.memo.findUnique({
    where: { id: parseInt(id) },
    include: { user: true, images: true },
  })

  return NRes.json({ memo })
}
