import { Wrap, MyProfile, MyPost, BackButton } from '@/components'
import { Typography, Stack } from '@mui/material'
import { getUser } from '@/lib/api/userApi'
import { Error } from '@mui/icons-material'

interface PageProps {
  params: { id: string }
}

export default async function Page({ params }: PageProps) {
  const { id } = await params
  const user = await getUser(id)

  return (
    <Wrap>
      {user ? (
        <>
          <MyProfile {...user} />
          <MyPost id={id} />
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
