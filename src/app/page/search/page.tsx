import SearchContainer from '@/components/container/SearchContainer'
import Navbar from '@/components/shared/Navbar'
import { Container } from '@mui/material'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export default async function SearchPage() {
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
        <SearchContainer myId={userId || 0} />
      </Container>
    </>
  )
}
