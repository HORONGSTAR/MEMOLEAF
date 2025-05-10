'use client'
import { Toolbar, Container, Stack } from '@mui/material'
import { Navbar } from '@/components'
import { BasicProps } from '@/lib/types'

export default function Wrap(props: BasicProps) {
  const { children } = props

  return (
    <>
      <Navbar />
      <Toolbar />
      <Container>
        <Stack py={2} px={{ sm: 2, xs: 0 }} spacing={2}>
          {children}
        </Stack>
      </Container>
    </>
  )
}
