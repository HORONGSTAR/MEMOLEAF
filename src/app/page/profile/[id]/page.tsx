import MyContainer from '@/components/container/MyContainer'
import { Container } from '@mui/material'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/prisma'
import { NotFound, Navbar, AlertBox } from '@/components/shared'

export default async function MyPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  const myId = session?.user.id

  const { id } = await params
  const userId = parseInt(id)
  const profile = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      info: true,
      note: true,
      image: true,
      cover: true,
      userNum: true,
      followings: true,
    },
  })

  const notificationCount = await prisma.notification.count({
    where: { recipientId: myId || 0 },
  })

  return (
    <>
      <Navbar count={notificationCount} />
      <Container component="main">{profile ? <MyContainer profile={profile} myId={myId || 0} /> : <NotFound />}</Container>
      <AlertBox />
    </>
  )
}
