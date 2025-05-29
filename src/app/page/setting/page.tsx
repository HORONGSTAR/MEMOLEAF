import SettingContainer from '@/components/container/SettingContainer'
import Navbar from '@/components/shared/Navbar'
import { Container } from '@mui/material'

export default async function SettingPage() {
  return (
    <>
      <Navbar />
      <Container component="main">
        <SettingContainer />
      </Container>
    </>
  )
}
