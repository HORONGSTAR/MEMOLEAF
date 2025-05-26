import HomeContainer from '@/components/Container/HomeContainer'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { decosToJson } from '@/shared/utils/common'
import prisma from '@/lib/prisma'
export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const session = await getServerSession(authOptions)
  const userId = session?.user.id

  const memolist = await prisma.memo.findMany({
    where: { parentId: null },
    take: 10,
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { id: true, name: true, image: true } },
      images: { select: { id: true, url: true, alt: true } },
      decos: { select: { id: true, kind: true, extra: true } },
      bookmarks: { where: { userId }, select: { id: true } },
      _count: { select: { comments: true, bookmarks: true, leafs: true } },
    },
  })

  const memos = memolist.map((item) => ({ ...item, decos: decosToJson(item.decos) }))
  const nextCursor = memos.length > 0 ? memos.slice(-1)[0].id : 0

  return <HomeContainer firstLoadMemos={memos} nextCursor={nextCursor} myId={userId} />
}
