import { NextRequest, NextResponse as NRes } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      const message = '로그인이 필요합니다.'
      return NRes.json({ success: false, message }, { status: 401 })
    }
    const { id } = await req.json()
    const search = await prisma.user.findUnique({ where: { id } })
    if (!search) {
      const message = '계정 정보를 찾을 수 없습니다.'
      return NRes.json({ success: false, message }, { status: 404 })
    }
    if (id == !session.user.id) {
      const message = '잘못된 접근입니다.'
      return NRes.json({ success: false, message }, { status: 405 })
    }
    await prisma.memo.deleteMany({ where: { userId: id } })
    return NRes.json('메모 삭제를 완료했습니다.')
  } catch (error) {
    console.error(error)
    const message = '메모 삭제 중 문제가 발생했습니다.'
    return NRes.json({ success: false, message }, { status: 500 })
  }
}
