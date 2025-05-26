import DetailContainer from '@/components/Container/DetailContainer'
import { Button, Stack, Typography } from '@mui/material'
import { ArrowBack, Error } from '@mui/icons-material'
import { getServerSession } from 'next-auth/next'
import { decosToJson } from '@/shared/utils/common'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import Link from 'next/link'

export default async function DetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  const userId = session?.user.id
  const { id } = await params
  const parentId = parseInt(id)
  const limit = 10

  const memo = await prisma.memo.findUnique({
    where: { id: parentId },
    include: {
      user: { select: { id: true, name: true, image: true } },
      decos: { select: { kind: true, extra: true } },
      images: { select: { id: true, url: true, alt: true } },
      bookmarks: { where: { userId } },
      leafs: { take: limit, select: { id: true } },
      _count: { select: { comments: true, bookmarks: true, leafs: true } },
    },
  })

  return (
    <>
      {memo ? (
        <DetailContainer firstLoadParent={{ ...memo, decos: decosToJson(memo.decos) }} myId={userId}>
          <Button startIcon={<ArrowBack />} LinkComponent={Link} href="/">
            목록으로 돌아가기
          </Button>
        </DetailContainer>
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
