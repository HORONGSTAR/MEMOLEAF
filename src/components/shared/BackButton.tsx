'use client'
import { useRouter } from 'next/navigation'
import { ArrowBack } from '@mui/icons-material'
import { Button } from '@mui/material'

export default function BackButton() {
  const router = useRouter()

  return (
    <Button startIcon={<ArrowBack />} onClick={() => router.back()}>
      목록으로 돌아가기
    </Button>
  )
}
