import SettingContainer from '@/components/container/SettingContainer'
import Navbar from '@/components/shared/Navbar'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { Container } from '@mui/material'
import { getServerSession } from 'next-auth'

export default async function SettingPage() {
  const session = await getServerSession(authOptions)
  const userId = session?.user.id

  const alarms = await prisma.alarm.findMany({
    where: { recipientId: userId || 0 },
    take: 10,
    include: { sander: true },
  })

  return (
    <>
      <Navbar alarms={alarms} />
      <Container component="main">
        <SettingContainer />
      </Container>
    </>
  )
}
