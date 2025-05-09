'use client'
import { Toolbar, Container, Stack } from '@mui/material'
import { Navbar } from '@/components'
import { BasicProps } from '@/lib/types'
import { useState, useEffect } from 'react'
import Image from 'next/image'

export default function Wrap(props: BasicProps) {
  const { children } = props
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 500)
    return () => clearTimeout(timer)
  }, [])

  const MainContent = () => (
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

  const SplashScreen = () => (
    <div className="splash-screen">
      <div>
        <Image src={'./leaf.svg'} alt="인트로" priority width={100} height={80} />
      </div>
    </div>
  )

  return ready ? <MainContent /> : <SplashScreen />
}
