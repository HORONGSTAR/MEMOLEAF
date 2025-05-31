import DetailContainer from '@/components/container/DetailContainer'
import { Button, Container, Stack, Typography } from '@mui/material'
import { ArrowBack, Error } from '@mui/icons-material'
import { getServerSession } from 'next-auth/next'
import { decosToJson } from '@/shared/utils/common'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import Navbar from '@/components/shared/Navbar'
import Link from 'next/link'

export default async function DetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  const userId = session?.user.id
  const { id } = await params
  const titleId = parseInt(id)

  const memo = await prisma.memo.findUnique({
    where: { id: titleId },
    include: {
      user: { select: { id: true, name: true, image: true, userNum: true } },
      decos: { select: { kind: true, extra: true } },
      images: { select: { id: true, url: true, alt: true } },
      bookmarks: { where: { userId }, select: { id: true } },
      favorites: {
        where: { userId },
        select: { id: true, user: { select: { name: true, image: true, id: true } } },
      },
      _count: { select: { favorites: true, bookmarks: true, leafs: true } },
    },
  })

  const alarms = await prisma.alarm.findMany({
    where: { recipientId: userId || 0 },
    take: 10,
    include: { sander: true },
  })

  return (
    <>
      <Navbar alarms={alarms} />
      {memo ? (
        <Container component="main">
          <DetailContainer
            firstLoadMemo={{
              ...memo,
              decos: decosToJson(memo.decos),
              bookmarks: memo.bookmarks[0],
              favorites: memo.favorites[0],
            }}
            myId={userId || 0}
          >
            <Button startIcon={<ArrowBack />} LinkComponent={Link} href="/">
              메모리프 홈으로 가기
            </Button>
          </DetailContainer>
        </Container>
      ) : (
        <Stack alignItems="center" spacing={2} pt={3}>
          <Stack alignItems="center" sx={{ bgcolor: '#eee', p: 2, borderRadius: 3 }}>
            <Error color="warning" sx={{ mb: 1 }} fontSize="large" />
            <Typography color="textSecondary">존재하지 않는 페이지입니다.</Typography>
          </Stack>
        </Stack>
      )}
    </>
  )
}
