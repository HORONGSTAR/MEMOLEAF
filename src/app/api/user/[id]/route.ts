import prisma from '@/lib/prisma'
import { NextRequest, NextResponse as NRes } from 'next/server'

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const user = await prisma.user.findUnique({ where: { id: parseInt(id) } })
    if (user) {
      return NRes.json(user)
    } else {
      return NRes.json({ error: '사용자를 찾을 수 없습니다.' }, { status: 404 })
    }
  } catch (err) {
    console.error(err)
    return NRes.json({ success: false, message: '프로필 조회 중 문제가 발생했습니다.' }, { status: 500 })
  }
}
