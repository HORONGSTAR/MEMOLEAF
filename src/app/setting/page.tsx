import { Wrap } from '@/components'
import { DeveloperMode } from '@mui/icons-material'
import { Typography, Stack } from '@mui/material'

function SettingPage() {
  return (
    <Wrap>
      <Stack alignItems="center" spacing={2} pt={3}>
        <Stack alignItems="center" sx={{ bgcolor: '#eee', p: 2, borderRadius: 3 }}>
          <DeveloperMode sx={{ mb: 1 }} color="info" fontSize="large" />
          <Typography>미안해요. 아직 준비 중이에요!</Typography>
          <Typography color="textSecondary" variant="body2">
            서비스를 더 편리하게 해줄 기능을 구현하고 있어요.
          </Typography>
        </Stack>
      </Stack>
    </Wrap>
  )
}

export default SettingPage
