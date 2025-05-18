import prisma from '@/lib/prisma'
import { NextRequest, NextResponse as NRes } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const keyword = searchParams.get('keyword')

    const whereData = {
      ...(keyword && { where: { name: { contains: keyword } } }),
    }
    const users = await prisma.user.findMany({
      ...whereData,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        name: true,
        image: true,
        info: true,
        userNum: true,
        _count: { select: { fromUsers: true, toUsers: true } },
      },
    })
    const totalCount = await prisma.user.count({ ...whereData })
    return NRes.json({
      users,
      total: Math.ceil(totalCount / limit),
    })
  } catch (error) {
    console.error(error)
    const message = '유저 목록 조회 중 문제가 발생했습니다.'
    return NRes.json({ success: false, message }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      const message = '로그인이 필요합니다.'
      return NRes.json({ success: false, message }, { status: 401 })
    }
    const id = session.user.id
    const { name, info, image } = await req.json()
    const result = await prisma.user.update({ where: { id }, data: { name, info, image } })
    return NRes.json(result)
  } catch (error) {
    console.error(error)
    const message = '프로필 수정 중 문제가 발생했습니다.'
    return NRes.json({ success: false, message }, { status: 500 })
  }
}
