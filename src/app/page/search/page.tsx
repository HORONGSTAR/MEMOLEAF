import SearchContainer from '@/components/container/SearchContainer'
import Footer from '@/components/shared/Footer'
import Navbar from '@/components/shared/Navbar'
import { Container } from '@mui/material'

export default async function SearchPage() {
  return (
    <>
      <Navbar />
      <Container sx={{ mb: 4, minHeight: '100vh' }}>
        <SearchContainer />
      </Container>
      <Footer />
    </>
  )
}
