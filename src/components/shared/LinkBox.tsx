'use client'
import { Box } from '@mui/material'
import { useRouter } from 'next/navigation'
import { ReactNode } from 'react'

interface Props {
  link: string
  children: ReactNode
}

export default function LinkBox(props: Props) {
  const { link, children } = props
  const router = useRouter()

  return (
    <Box
      component="span"
      onClick={(e) => {
        e.stopPropagation()
        router.push(link)
      }}
      sx={{ cursor: 'pointer' }}
    >
      {children}
    </Box>
  )
}
