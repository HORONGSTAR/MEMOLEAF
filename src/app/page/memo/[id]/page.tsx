import { getMemoById } from '@/lib/api/memoApi'
import { Wrap, MemoDetail, BackButton } from '@/components'
import { Stack, Typography } from '@mui/material'
import { Error } from '@mui/icons-material'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const memo = await getMemoById(id)

  return (
    <Wrap>
      {memo.id ? (
        <>
          <MemoDetail {...memo} />
        </>
      ) : (
        <Stack alignItems="center" spacing={2} pt={3}>
          <Stack alignItems="center" sx={{ bgcolor: '#eee', p: 2, borderRadius: 3 }}>
            <Error color="warning" />
            <Typography color="textSecondary">존재하지 않는 페이지 입니다.</Typography>
          </Stack>
          <BackButton />
        </Stack>
      )}
    </Wrap>
  )
}
