'use client'
import { useRouter } from 'next/navigation'
import { ArrowBack } from '@mui/icons-material'
import { IconButton } from '@mui/material'

export default function BackButton() {
  const router = useRouter()

  return (
    <IconButton onClick={() => router.back()}>
      <ArrowBack fontSize="small" />
    </IconButton>
  )
}
