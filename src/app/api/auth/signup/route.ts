import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'
import * as bcrypt from 'bcrypt'

export async function POST(req: NextResponse) {
   const { email, name, password } = await req.json()

   const newUser = await prisma.user.create({
      data: { email, name, password: await bcrypt.hash(password, 10) },
   })

   return NextResponse.json(newUser)
}
