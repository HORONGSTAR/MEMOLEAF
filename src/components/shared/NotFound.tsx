import { Stack, Typography } from '@mui/material'
import { Error } from '@mui/icons-material'

export default function NotFound() {
  return (
    <Stack alignItems="center" justifyContent="center" spacing={2} minHeight="100vh">
      <Stack alignItems="center" sx={{ bgcolor: '#eee', p: 2, borderRadius: 3 }}>
        <Error color="warning" sx={{ mb: 1 }} fontSize="large" />
        <Typography color="textSecondary">존재하지 않는 페이지입니다.</Typography>
      </Stack>
    </Stack>
  )
}
