import { NextRequest, NextResponse as NRes } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const cursor = parseInt(searchParams.get('cursor') || '0')
    const keyword = searchParams.get('keyword')

    const memolist = await prisma.memo.findMany({
      where: {
        id: { lt: cursor },
        decos: { none: { kind: 'secret' } },
        ...(keyword && { content: { contains: keyword } }),
      },
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        images: { select: { id: true, url: true, alt: true } },
        decos: { select: { id: true, kind: true, extra: true } },
        user: { select: { id: true, name: true, image: true, userNum: true } },
      },
    })

    const searchTotal = await prisma.memo.count({
      where: {
        decos: { none: { kind: 'secret' } },
        ...(keyword && { content: { contains: keyword } }),
      },
    })

    const memos = memolist.map((item) => {
      const decos = {
        subtext: { active: 'off', extra: '' },
        folder: { active: 'off', extra: '' },
        secret: { active: 'off', extra: '' },
      }
      item.decos.forEach((deco) => (decos[deco.kind] = { active: 'on', extra: deco.extra }))
      return { ...item, decos }
    })

    const nextCursor = memos[9]?.id || -1

    return NRes.json({
      memos,
      searchTotal,
      nextCursor,
    })
  } catch (error) {
    console.error(error)
    const message = '메모 목록 조회 중 문제가 발생했습니다.'
    return NRes.json({ success: false, message }, { status: 500 })
  }
}
