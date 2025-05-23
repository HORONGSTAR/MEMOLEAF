'use client'
import ErrorIcon from '@mui/icons-material/Error'
import { Button, Stack, Typography } from '@mui/material'
import { useEffect } from 'react'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <Stack alignItems="center" spacing={2} pt={3}>
      <Stack alignItems="center" sx={{ bgcolor: '#eee', p: 2, borderRadius: 3 }}>
        <ErrorIcon color="warning" sx={{ mb: 1 }} fontSize="large" />
        <Typography color="textSecondary">문제가 발생했습니다.</Typography>
        <Button onClick={() => reset()}>다시 시도</Button>
      </Stack>
    </Stack>
  )
}
