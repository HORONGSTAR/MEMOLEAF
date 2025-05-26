import prisma from '@/lib/prisma'
import { NextRequest, NextResponse as NRes } from 'next/server'

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        name: true,
        image: true,
        info: true,
        userNum: true,
        _count: { select: { fromUsers: true, toUsers: true } },
      },
    })
    if (!user) {
      const message = '사용자를 찾을 수 없습니다.'
      return NRes.json({ success: false, message }, { status: 404 })
    }
    return NRes.json(user)
  } catch (err) {
    console.error(err)
    const message = '프로필 조회 중 문제가 발생했습니다.'
    return NRes.json({ success: false, message }, { status: 500 })
  }
}
