import { NextRequest, NextResponse as NRes } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { NotificationWithRelations } from '@/shared/types/get'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const recipientId = session?.user.id
    const { searchParams } = new URL(req.url)
    const cursor = parseInt(searchParams.get('cursor') || '0')

    const notificationList = await prisma.notification.findMany({
      where: { recipientId, id: { lt: cursor } },
      take: 10,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        aria: true,
        sander: { select: { id: true, name: true, image: true, info: true } },
        memo: { select: { id: true, content: true } },
      },
    })

    const notifications = notificationList as NotificationWithRelations[]

    const nextCursor = notifications[9]?.id || -1
    return NRes.json({
      notifications,
      nextCursor,
    })
  } catch (error) {
    console.error(error)
    const message = '알림 목록 조회 중 문제가 발생했습니다.'
    return NRes.json({ success: false, message }, { status: 500 })
  }
}

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      const message = '로그인이 필요합니다.'
      return NRes.json({ success: false, message }, { status: 401 })
    }
    const recipientId = session.user.id
    await prisma.notification.deleteMany({ where: { recipientId } })
    return NRes.json('삭제 완료')
  } catch (error) {
    console.error(error)
    const message = '알림 삭제 중 문제가 발생했습니다.'
    return NRes.json({ success: false, message }, { status: 500 })
  }
}
