import { Wrap, MyProfile, MyPost } from '@/components'
import { Typography, Stack } from '@mui/material'
import { getProfile } from '@/lib/api/userApi'
import { Error } from '@mui/icons-material'

export default async function MyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const profile = await getProfile(id)

  return (
    <Wrap>
      {profile ? (
        <>
          <MyProfile {...profile} />
          <MyPost id={id} />
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
