import { NextRequest, NextResponse as NRes } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const keyword = searchParams.get('keyword')

    const whereData = {
      ...(keyword && {
        where: {
          parentId: parseInt(id),
          content: { contains: keyword },
        },
      }),
    }
    const memos = await prisma.bookMark.findMany({
      where: { userId: parseInt(id) },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { memo: { include: { user: true } } },
    })
    const totalCount = await prisma.memo.count({ ...whereData })
    return NRes.json({
      memos,
      total: Math.ceil(totalCount / limit),
    })
  } catch (error) {
    console.error(error)
    const message = '북마크 조회 중 문제가 발생했습니다.'
    return NRes.json({ success: false, message }, { status: 500 })
  }
}
