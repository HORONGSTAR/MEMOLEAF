import { getMemoById } from '@/lib/api/memoApi'
import { Wrap, BackButton, MemoThread, MemoCard } from '@/components'
import { Stack, Typography } from '@mui/material'
import { Error } from '@mui/icons-material'

export default async function MemoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { memo } = await getMemoById(id)

  return (
    <Wrap>
      {memo ? (
        <>
          <div>
            <BackButton />
          </div>
          <MemoCard memo={memo} isDetail />
        </>
      ) : (
        <Stack alignItems="center" spacing={2} pt={3}>
          <Stack alignItems="center" sx={{ bgcolor: '#eee', p: 2, borderRadius: 3 }}>
            <Error color="warning" sx={{ mb: 1 }} fontSize="large" />
            <Typography color="textSecondary">존재하지 않는 페이지입니다.</Typography>
          </Stack>
        </Stack>
      )}
      <MemoThread id={parseInt(id)} total={memo._count.leafs} userId={memo.userId} />
    </Wrap>
  )
}
