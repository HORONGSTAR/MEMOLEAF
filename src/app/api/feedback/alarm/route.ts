import { NextRequest, NextResponse as NRes } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      const message = '로그인이 필요합니다.'
      return NRes.json({ success: false, message }, { status: 401 })
    }

    const authorId = session.user.id
    const alarms = await prisma.alarm.findMany({
      where: { authorId },
      take: 10,
      include: { reader: true },
      orderBy: { id: 'desc' },
    })

    const count = await prisma.alarm.count({ where: { authorId } })

    return NRes.json({ alarms, count })
  } catch (error) {
    console.error(error)
    const message = '알림 조회 중 문제가 발생했습니다.'
    return NRes.json({ success: false, message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      const message = '로그인이 필요합니다.'
      return NRes.json({ success: false, message }, { status: 401 })
    }
    const authorId = session.user.id
    const { aria, readerId, linkId } = await req.json()
    const newAlarm = await prisma.alarm.create({
      data: { aria, authorId, linkId, readerId },
    })
    return NRes.json(newAlarm)
  } catch (error) {
    console.error(error)
    const message = '알림 등록 중 문제가 발생했습니다.'
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
    const authorId = session.user.id
    await prisma.alarm.deleteMany({ where: { authorId } })
    return NRes.json('삭제 완료')
  } catch (error) {
    console.error(error)
    const message = '알림 삭제 중 문제가 발생했습니다.'
    return NRes.json({ success: false, message }, { status: 500 })
  }
}
