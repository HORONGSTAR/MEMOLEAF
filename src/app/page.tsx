import HomeContainer from '@/components/container/HomeContainer'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { decosToJson } from '@/shared/utils/common'
import prisma from '@/lib/prisma'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import AlarmBox from '@/components/shared/AlarmBox'
import { Container, IconButton } from '@mui/material'
import { Search } from '@mui/icons-material'
import Link from 'next/link'

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

  const alarms =
    (await prisma.alarm.findMany({
      where: { authorId: userId || 0 },
      take: 10,
      include: { reader: true },
    })) || []

  return (
    <>
      <Navbar>
        <IconButton aria-label="검색 페이지" component={Link} href="/page/search">
          <Search />
        </IconButton>
        <AlarmBox alarms={alarms} count={alarms.length} />
      </Navbar>
      <Container sx={{ mb: 4, minHeight: '90vh' }}>
        <HomeContainer firstLoadMemos={memos} myId={userId || 0} />
      </Container>
      <Footer />
    </>
  )
}
