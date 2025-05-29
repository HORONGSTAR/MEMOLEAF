import SearchContainer from '@/components/container/SearchContainer'
import Footer from '@/components/shared/Footer'
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
      <Container sx={{ mb: 4, minHeight: '100vh' }}>
        <SearchContainer myId={myId || 0} />
      </Container>
      <Footer />
    </>
  )
}
