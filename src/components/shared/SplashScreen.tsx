'use client'
import { useEffect, useState } from 'react'
import { Box } from '@mui/material'
import Image from 'next/image'
import { BasicProps } from '@/lib/types'

export default function SplashScreen(props: BasicProps) {
  const { children } = props
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      {!ready ? (
        <Box sx={{ display: 'flex', width: '100%', height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
          <Box sx={{ animation: 'spinY 1.5s ease-in-out forwards', transformStyle: 'preserve-3d' }}>
            <Image src={'/leaf.svg'} alt="인트로" width={100} height={80} />
          </Box>
        </Box>
      ) : (
        children
      )}
    </>
  )
}
