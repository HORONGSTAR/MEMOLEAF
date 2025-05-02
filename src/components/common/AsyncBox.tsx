import { CircularProgress } from '@mui/material'
import { ReactNode } from 'react'

interface Props {
  state: 'idle' | 'loading' | 'succeeded' | 'failed'
  component: ReactNode
}
export default function AsyncBox(props: Props) {
  const components = { idle: null, loading: <CircularProgress />, succeeded: props.component, failed: null }
  return components[props.state]
}
