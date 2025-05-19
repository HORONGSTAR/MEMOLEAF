import prisma from '@/lib/prisma'
import { NextRequest, NextResponse as NRes } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const keyword = searchParams.get('keyword')

    const whereData = {
      ...(keyword && {
        where: {
          OR: [{ name: { contains: keyword } }, { userNum: parseInt(keyword) }, { info: { contains: keyword } }],
        },
      }),
    }

    const users = await prisma.user.findMany({
      ...whereData,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    })
    const totalCount = await prisma.user.count({ ...whereData })
    return NRes.json({
      users,
      total: totalCount,
    })
  } catch (error) {
    console.error(error)
    const message = '유저 목록 조회 중 문제가 발생했습니다.'
    return NRes.json({ success: false, message }, { status: 500 })
  }
}
