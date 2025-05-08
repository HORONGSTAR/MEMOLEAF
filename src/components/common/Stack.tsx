import { StackProps, Stack } from '@mui/material'

export default function rowStack(props: StackProps) {
  return <Stack {...props} direction="row" alignItems="center" />
}
