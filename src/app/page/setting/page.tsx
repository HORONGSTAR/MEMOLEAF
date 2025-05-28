import SettingContainer from '@/components/container/SettingContainer'
import Footer from '@/components/shared/Footer'
import Navbar from '@/components/shared/Navbar'
import { Container } from '@mui/material'

export default async function SettingPage() {
  return (
    <>
      <Navbar />
      <Container sx={{ mb: 4, minHeight: '100vh' }}>
        <SettingContainer />
      </Container>
      <Footer />
    </>
  )
}
