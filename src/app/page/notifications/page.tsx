import NotificationsContainer from '@/components/container/NotificationsContainer'
import { Container } from '@mui/material'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import AuthGuard from '@/components/auth/AuthGuard'
import { Navbar, AlertBox } from '@/components/shared'
import prisma from '@/lib/prisma'

export default async function notificationPage() {
  const session = await getServerSession(authOptions)
  const myId = session?.user.id

  const notificationCount = await prisma.notification.count({
    where: { recipientId: myId || 0 },
  })

  const notifications = await prisma.notification.findMany({
    where: { recipientId: myId || 0 },
    take: 10,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      aria: true,
      sander: { select: { id: true, name: true, image: true, info: true } },
      memo: { select: { id: true, content: true } },
    },
  })

  return (
    <>
      <Container component="main">
        <AuthGuard myId={myId}>
          <Navbar count={notificationCount} />
          <NotificationsContainer firstLoadData={notifications} />
        </AuthGuard>
      </Container>
      <AlertBox />
    </>
  )
}
