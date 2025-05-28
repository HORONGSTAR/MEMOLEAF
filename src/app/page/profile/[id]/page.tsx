import { Typography, Stack, Container } from '@mui/material'
import { Error } from '@mui/icons-material'
import MyContainer from '@/components/container/MyContainer'
import prisma from '@/lib/prisma'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'

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

  return (
    <>
      <Navbar />
      {profile ? (
        <Container sx={{ mb: 4, minHeight: '100vh' }}>
          <MyContainer profile={profile} />
        </Container>
      ) : (
        <Stack alignItems="center" spacing={2} pt={3}>
          <Stack alignItems="center" sx={{ bgcolor: '#eee', p: 2, borderRadius: 3 }}>
            <Error color="warning" sx={{ mb: 1 }} fontSize="large" />
            <Typography color="textSecondary">존재하지 않는 페이지입니다.</Typography>
          </Stack>
        </Stack>
      )}
      <Footer />
    </>
  )
}
