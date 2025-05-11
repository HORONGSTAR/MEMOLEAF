'use client'
import { Toolbar, Container, Stack, Box } from '@mui/material'
import { Navbar } from '@/components'
import { BasicProps } from '@/lib/types'

export default function Wrap(props: BasicProps) {
  const { children } = props

  return (
    <Stack minHeight="100vh" justifyContent={'space-between'}>
      <Box>
        <Navbar />
        <Toolbar />
        <Container>
          <Stack py={2} px={{ sm: 2, xs: 0 }} spacing={2}>
            {children}
          </Stack>
        </Container>
      </Box>
      <footer>내용</footer>
    </Stack>
  )
}
