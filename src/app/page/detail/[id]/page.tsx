import DetailContainer from '@/components/container/DetailContainer'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { Button, Container } from '@mui/material'
import { ArrowBack } from '@mui/icons-material'
import { decosToJson } from '@/shared/utils/common'
import { NotFound, Navbar, AlertBox } from '@/components/shared'
import prisma from '@/lib/prisma'
import Link from 'next/link'

export default async function DetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  const myId = session?.user.id
  const { id } = await params
  const titleId = parseInt(id)

  const memo = await prisma.memo.findUnique({
    where: { id: titleId },
    include: {
      user: { select: { id: true, name: true, image: true, userNum: true } },
      decos: { select: { kind: true, extra: true } },
      images: { select: { id: true, url: true, alt: true } },
      bookmarks: { where: { userId: myId }, select: { id: true } },
      favorites: {
        where: { userId: myId },
        select: { id: true, user: { select: { name: true, image: true, id: true } } },
      },
      _count: { select: { favorites: true, bookmarks: true, leafs: true } },
    },
  })
  const notificationCount = await prisma.notification.count({
    where: { recipientId: myId || 0 },
  })

  return (
    <>
      <Navbar count={notificationCount} />
      <Container component="main">
        {memo ? (
          <DetailContainer
            firstLoadMemo={{
              ...memo,
              decos: decosToJson(memo.decos),
              bookmarks: memo.bookmarks[0],
              favorites: memo.favorites[0],
            }}
            myId={myId || 0}
          >
            <Button startIcon={<ArrowBack />} LinkComponent={Link} href="/">
              메모리프 홈으로 가기
            </Button>
          </DetailContainer>
        ) : (
          <NotFound />
        )}
      </Container>
      <AlertBox />
    </>
  )
}
