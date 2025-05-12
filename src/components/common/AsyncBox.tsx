import { CircularProgress } from '@mui/material'
import { ReactNode } from 'react'

interface Props {
  state: 'idle' | 'loading' | 'succeeded' | 'failed'
  children: ReactNode
}
export default function AsyncBox(props: Props) {
  const { state, children } = props

  const components = {
    idle: null,
    loading: <CircularProgress />,
    succeeded: children,
    failed: null,
  }

  return components[state]
}
