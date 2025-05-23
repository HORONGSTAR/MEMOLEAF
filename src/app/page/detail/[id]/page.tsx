import { MemoBox } from '@/components/memo'
import { Button, Stack, Typography } from '@mui/material'
import { ArrowBack, Error } from '@mui/icons-material'
import prisma, { disconnectPrisma } from '@/lib/prisma'
import Link from 'next/link'
import MemoThread from '@/components/memo/MemoThread'
import MemoThreadForm from '@/components/memo/MemoThreadForm'

export default async function DetailPage({ params }: { params: Promise<{ id: string }> }) {
  disconnectPrisma()

  const { id } = await params
  const memo = await prisma.memo.findUnique({
    where: { id: parseInt(id) },
    include: {
      user: true,
      decos: true,
      images: true,
      bookmarks: { where: { userId: parseInt(id) } },
      leafs: { take: 1, select: { id: true } },
      _count: { select: { comments: true, bookmarks: true, leafs: true } },
    },
  })

  return (
    <>
      {memo ? (
        <div>
          <Button startIcon={<ArrowBack />} LinkComponent={Link} href="/">
            목록으로 돌아가기
          </Button>
          <MemoBox memo={memo} layout="detail" thread={<MemoThread id={memo.id} count={memo._count.leafs} />} />
          <MemoThreadForm id={memo.id} count={memo._count.leafs} userId={memo.userId} />
        </div>
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
