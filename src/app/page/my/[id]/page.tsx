import MyContainer from '@/components/Container/MyContainer'
import { Typography, Stack } from '@mui/material'
import { Error } from '@mui/icons-material'
import prisma from '@/lib/prisma'
import { MyProfile } from '@/components/user'

export default async function MyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const userId = parseInt(id)
  const profile = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      image: true,
      info: true,
      userNum: true,
      toUsers: true,
    },
  })

  const lastMemo = await prisma.memo.findFirst({
    where: { parentId: null },
    orderBy: { createdAt: 'desc' },
    select: { id: true },
  })

  return (
    <>
      {profile ? (
        <>
          <MyProfile {...profile} />
          <MyContainer id={profile.id} name={profile.name} lastMemoId={lastMemo?.id} />
        </>
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
