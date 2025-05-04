import { CircularProgress } from '@mui/material'
import { ReactNode } from 'react'

interface Props {
  state: 'idle' | 'loading' | 'succeeded' | 'failed'
  component: ReactNode
}
export default function AsyncBox(props: Props) {
  const { state, component } = props

  const components = {
    idle: null,
    loading: <CircularProgress />,
    succeeded: component,
    failed: null,
  }

  return components[state]
}
