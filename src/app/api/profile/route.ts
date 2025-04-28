import prisma from '@/lib/prisma'
import { NextRequest, NextResponse as NRes } from 'next/server'

export async function GET(req: NextRequest) {
   try {
      const { searchParams } = new URL(req.url)
      const params = searchParams.get('id')
      if (!params) return NRes.json({ error: '잘못된 요청입니다.' }, { status: 400 })

      const id = parseInt(params)
      const user = await prisma.user.findUnique({
         where: { id },
      })

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

export async function PATCH(req: NextRequest) {
   try {
      const { name, info, id } = await req.json()
      const user = await prisma.user.findUnique({ where: { id } })
      if (user) {
         const result = await prisma.user.update({ where: { id }, data: { name, info } })
         return NRes.json(result)
      } else {
         return NRes.json({ error: '사용자가 존재하지 않습니다.' }, { status: 400 })
      }
   } catch (err) {
      console.error(err)
      return NRes.json({ success: false, message: '프로필 수정 중 문제가 발생했습니다.' }, { status: 500 })
   }
}
