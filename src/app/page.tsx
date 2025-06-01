import HomeContainer from '@/components/container/HomeContainer'
import { Navbar, AlertBox } from '@/components/shared'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { decosToJson } from '@/shared/utils/common'
import { Container } from '@mui/material'
import prisma from '@/lib/prisma'

export default async function HomePage() {
  const session = await getServerSession(authOptions)
  const userId = session?.user.id

  const memolist = await prisma.memo.findMany({
    where: { titleId: null },
    take: 10,
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { id: true, name: true, image: true, userNum: true } },
      images: { select: { id: true, url: true, alt: true } },
      decos: { select: { id: true, kind: true, extra: true } },
      bookmarks: { where: { userId }, select: { id: true } },
      favorites: { where: { userId }, select: { id: true } },
      _count: { select: { bookmarks: true, favorites: true, leafs: true } },
    },
  })

  const memos = memolist.map((item) => {
    return {
      ...item,
      decos: decosToJson(item.decos),
      bookmarks: item.bookmarks[0],
      favorites: item.favorites[0],
    }
  })

  const notificationCount = await prisma.notification.count({
    where: { recipientId: userId || 0 },
  })

  return (
    <>
      <Navbar count={notificationCount} />
      <Container component="main">
        <HomeContainer firstLoadMemos={memos} myId={userId || 0} />
      </Container>
      <AlertBox />
    </>
  )
}
