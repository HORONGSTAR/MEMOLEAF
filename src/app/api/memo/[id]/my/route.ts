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
          parentId: null,
          userId: parseInt(id),
          content: { contains: keyword },
        },
      }),
    }

    const memos = await prisma.memo.findMany({
      ...whereData,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: true,
        images: true,
        decos: true,
        _count: { select: { comments: true, bookmarks: true, leafs: true } },
      },
    })

    const totalCount = await prisma.memo.count({ ...whereData })

    return NRes.json({
      memos,
      total: Math.ceil(totalCount / limit),
    })
  } catch (error) {
    console.error(error)
    const message = '유저 메모 조회 중 문제가 발생했습니다.'
    return NRes.json({ success: false, message }, { status: 500 })
  }
}
