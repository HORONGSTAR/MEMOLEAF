import { BackButton, MemoBox } from '@/components'
import { Stack, Typography } from '@mui/material'
import { Error } from '@mui/icons-material'
import prisma, { disconnectPrisma } from '@/lib/prisma'

export default async function DetailPage({ params }: { params: Promise<{ id: string }> }) {
  disconnectPrisma()

  const { id } = await params
  const memo = await prisma.memo.findUnique({
    where: { id: parseInt(id) },
    include: {
      user: true,
      decos: true,
      images: true,
      _count: { select: { comments: true, bookmarks: true, leafs: true } },
    },
  })

  return (
    <>
      {memo ? (
        <div>
          <BackButton />
          <MemoBox memo={memo} layout="detail" />
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
