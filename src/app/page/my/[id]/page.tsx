import { Typography, Stack } from '@mui/material'
import { Error } from '@mui/icons-material'
import MyContainer from '@/components/container/MyContainer'
import prisma from '@/lib/prisma'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import AlarmBox from '@/components/shared/AlarmBox'

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

  const lastUser = await prisma.user.findFirst({
    orderBy: { createdAt: 'desc' },
    select: { id: true },
  })

  const alarms = await prisma.alarm.findMany({
    where: { authorId: userId },
    take: 30,
    include: { reader: true },
  })

  return (
    <>
      <Navbar>
        <AlarmBox {...alarms} count={alarms.length} />
      </Navbar>
      {profile ? (
        <>
          <MyContainer profile={profile} lastMemoId={lastMemo?.id || 0} lastUserId={lastUser?.id || 0} />
          <Footer />
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
