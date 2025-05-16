import { Wrap, MyProfile, MyPost } from '@/components'
import { Typography, Stack } from '@mui/material'
import { getUser } from '@/lib/api/userApi'
import { Error } from '@mui/icons-material'
import { getMemos } from '@/lib/api/memoApi'

export default async function MyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await getUser(id)
  const data = await getMemos({ page: 1, limit: 10, userId: id })

  return (
    <Wrap>
      {user ? (
        <>
          <MyProfile {...user} />
          <MyPost id={id} posts={data.memos} total={data.total} />
        </>
      ) : (
        <Stack alignItems="center" spacing={2} pt={3}>
          <Stack alignItems="center" sx={{ bgcolor: '#eee', p: 2, borderRadius: 3 }}>
            <Error color="warning" sx={{ mb: 1 }} fontSize="large" />
            <Typography color="textSecondary">존재하지 않는 페이지입니다.</Typography>
          </Stack>
        </Stack>
      )}
    </Wrap>
  )
}
