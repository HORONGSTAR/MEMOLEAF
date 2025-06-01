import SearchContainer from '@/components/container/SearchContainer'
import { Navbar, AlertBox } from '@/components/shared'
import { Container } from '@mui/material'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export default async function SearchPage() {
  const session = await getServerSession(authOptions)
  const myId = session?.user.id

  const notificationCount = await prisma.notification.count({
    where: { recipientId: myId || 0 },
  })

  return (
    <>
      <Navbar count={notificationCount} />
      <Container component="main">
        <SearchContainer myId={myId || 0} />
      </Container>
      <AlertBox />
    </>
  )
}
