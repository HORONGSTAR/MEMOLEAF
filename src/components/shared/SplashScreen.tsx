'use client'
import { ReactNode, useEffect, useState } from 'react'
import { Box, Stack } from '@mui/material'
import { setProfile } from '@/store/slices/profileSlice'
import { useAppDispatch } from '@/store/hooks'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Footer from './Footer'

export default function SplashScreen({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false)
  const [mounted, setMounted] = useState(false)
  const dispatch = useAppDispatch()
  const { data: session } = useSession()

  useEffect(() => {
    setMounted(true)
    const timer = setTimeout(() => setReady(true), 500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (session) dispatch(setProfile(session.user))
  }, [dispatch, session])

  if (!mounted) return null

  return (
    <>
      {!ready ? (
        <Box sx={{ display: 'flex', width: '100%', height: '100vh' }}>
          <Box
            sx={{
              m: 'auto',
              position: 'relative',
              animation: 'spinY 0.5s ease-in-out forwards',
              transformStyle: 'preserve-3d',
            }}
          >
            <Image src={'/leaf.svg'} alt="인트로" width={80} height={100} priority />
          </Box>
        </Box>
      ) : (
        <Stack minHeight="100vh">
          {children}
          <Footer />
        </Stack>
      )}
    </>
  )
}
