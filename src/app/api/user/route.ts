import prisma from '@/lib/prisma'
import { NextRequest, NextResponse as NRes } from 'next/server'

export async function PATCH(req: NextRequest) {
  try {
    const { id, name, info, image } = await req.json()
    const user = await prisma.user.findUnique({ where: { id } })
    if (user) {
      const result = await prisma.user.update({ where: { id }, data: { name, info, image } })
      return NRes.json(result)
    } else {
      return NRes.json({ error: '사용자가 존재하지 않습니다.' }, { status: 400 })
    }
  } catch (err) {
    console.error(err)
    return NRes.json({ success: false, message: '프로필 수정 중 문제가 발생했습니다.' }, { status: 500 })
  }
}
