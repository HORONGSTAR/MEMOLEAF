'use client'
import { useEffect, useState } from 'react'
import { Box } from '@mui/material'
import Image from 'next/image'
import { BasicProps } from '@/lib/types'

export default function SplashScreen(props: BasicProps) {
  const { children } = props
  const [ready, setReady] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const timer = setTimeout(() => setReady(true), 500)
    return () => clearTimeout(timer)
  }, [])

  if (!mounted) return null

  return (
    <>
      {!ready ? (
        <Box sx={{ display: 'flex', width: '100%', height: '100vh' }}>
          <Box
            sx={{
              m: 'auto',
              width: 100,
              height: 100,
              position: 'relative',
              animation: 'spinY 0.5s ease-in-out forwards',
              transformStyle: 'preserve-3d',
            }}
          >
            <Image src={'/leaf.svg'} alt="인트로" fill />
          </Box>
        </Box>
      ) : (
        children
      )}
    </>
  )
}
