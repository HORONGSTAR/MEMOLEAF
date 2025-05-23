import { Stack, Typography } from '@mui/material'
import { ReactNode } from 'react'

interface Props {
  count: number
  color?: string
  children: ReactNode
}

export default function FeedbackCount(props: Props) {
  const { color, count, children } = props
  return (
    <Stack direction="row" alignItems="center" minWidth={60}>
      {children}
      <Typography fontWeight="bold" variant="body2" color={color || 'textSecondary'}>
        {count > 100 ? '99+' : count}
      </Typography>
    </Stack>
  )
}
