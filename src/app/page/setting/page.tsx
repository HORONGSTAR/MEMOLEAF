import SettingContainer from '@/components/container/SettingContainer'
import AuthGuard from '@/components/auth/AuthGuard'
import { Navbar, AlertBox } from '@/components/shared'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { Container } from '@mui/material'
import { getServerSession } from 'next-auth'

export default async function SettingPage() {
  const session = await getServerSession(authOptions)
  const myId = session?.user.id

  const notificationCount = await prisma.notification.count({
    where: { recipientId: myId || 0 },
  })

  return (
    <>
      <Navbar count={notificationCount} />
      <Container component="main">
        <AuthGuard myId={myId}>
          <SettingContainer />
        </AuthGuard>
      </Container>
      <AlertBox />
    </>
  )
}
