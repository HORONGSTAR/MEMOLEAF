import { CircularProgress, Stack } from '@mui/material'

export default function Loading() {
  return (
    <Stack alignItems="center" justifyContent="center" minHeight="100vh">
      <CircularProgress />
    </Stack>
  )
}
