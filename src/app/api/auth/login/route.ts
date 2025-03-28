import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'
import * as bcrypt from 'bcrypt'

export async function POST(req: NextResponse) {
   const { email, password } = await req.json()
   const user = await prisma.user.findUnique({ where: { email } })
   if (user && (await bcrypt.compare(password, user.password))) {
      return new Response(JSON.stringify(user))
   } else return new Response(JSON.stringify(null))
}
