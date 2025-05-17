'use client'
import { useEffect, useState } from 'react'
import { Box } from '@mui/material'
import Image from 'next/image'
import { BasicProps } from '@/lib/types'
import { useAppDispatch } from '@/store/hooks'
import { getProfileThunk } from '@/store/slices/profileSlice'
import { useSession } from 'next-auth/react'

export default function SplashScreen(props: BasicProps) {
  const { children } = props
  const [ready, setReady] = useState(false)
  const [mounted, setMounted] = useState(false)
  const dispatch = useAppDispatch()
  const { data: session } = useSession()
  const myId = session?.user.id

  useEffect(() => {
    setMounted(true)
    const timer = setTimeout(() => setReady(true), 500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    setMounted(true)
    if (myId) dispatch(getProfileThunk(myId))
  }, [dispatch, myId])

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
