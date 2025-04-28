import { NextRequest, NextResponse as NRes } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')

  const data = await prisma.memo.findMany({
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { createdAt: 'desc' },
    include: { user: true },
  })

  const totalCount = await prisma.user.count()

  return NRes.json({
    data,
    totalPages: Math.ceil(totalCount / limit),
    currentPage: page,
  })
}

export async function POST(req: NextRequest) {
  try {
    const { userId, content } = await req.json()
    const memo = await prisma.memo.create({ data: { userId, content } })
    return NRes.json(memo)
  } catch (err) {
    console.error(err)
    return NRes.json({ success: false, message: '게시글 등록 중 문제가 발생했습니다.' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, content } = await req.json()
    const memo = await prisma.memo.findUnique({ where: { id } })
    if (memo) {
      const result = await prisma.memo.update({ where: { id }, data: { content } })
      return NRes.json(result)
    } else {
      return NRes.json({ error: '게시글을 찾을 수 없습니다.' }, { status: 404 })
    }
  } catch (err) {
    console.error(err)
    return NRes.json({ success: false, message: '게시글 수정 중 문제가 발생했습니다.' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json()
    const memo = await prisma.memo.findUnique({ where: { id } })
    if (memo) {
      await prisma.memo.delete({ where: { id } })
      return NRes.json({ id })
    } else {
      return NRes.json({ error: '게시글을 찾을 수 없습니다.' }, { status: 404 })
    }
  } catch (err) {
    console.error(err)
    return NRes.json({ success: false, message: '게시글 삭제 중 문제가 발생했습니다.' }, { status: 500 })
  }
}
