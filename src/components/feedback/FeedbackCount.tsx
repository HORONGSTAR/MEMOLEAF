import { Stack, Typography } from '@mui/material'
import { ReactNode } from 'react'

interface Props {
  count: number
  children: ReactNode
}

export default function FeedbackCount(props: Props) {
  const { count, children } = props
  return (
    <Stack direction="row" alignItems="center" minWidth={50}>
      {children}
      <Typography variant="button" color="textSecondary">
        {count > 100 ? '9+' : count}
      </Typography>
    </Stack>
  )
}
