import { CircularProgress, Stack } from '@mui/material'
import { ReactNode } from 'react'

interface Props {
  state: 'idle' | 'loading' | 'succeeded' | 'failed'
  children: ReactNode
}
export default function AsyncBox(props: Props) {
  const { state, children } = props

  const components = {
    idle: null,
    loading: (
      <Stack alignItems="center" justifyContent="center" minHeight={200}>
        <CircularProgress />
      </Stack>
    ),
    succeeded: children,
    failed: null,
  }

  return components[state]
}
