import { NextResponse as NRes } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      const message = '로그인이 필요합니다.'
      return NRes.json({ success: false, message }, { status: 401 })
    }
    const recipientId = session.user.id
    await prisma.alarm.deleteMany({ where: { recipientId } })
    return NRes.json('삭제 완료')
  } catch (error) {
    console.error(error)
    const message = '알림 삭제 중 문제가 발생했습니다.'
    return NRes.json({ success: false, message }, { status: 500 })
  }
}
