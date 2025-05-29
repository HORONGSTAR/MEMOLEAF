import SearchContainer from '@/components/container/SearchContainer'
import Navbar from '@/components/shared/Navbar'
import { Container } from '@mui/material'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export default async function SearchPage() {
  const session = await getServerSession(authOptions)
  const myId = session?.user.id
  return (
    <>
      <Navbar />
      <Container component="main">
        <SearchContainer myId={myId || 0} />
      </Container>
    </>
  )
}
