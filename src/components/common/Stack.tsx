import { Stack as MuiStack, StackProps } from '@mui/material'

export default function Stack(props: StackProps) {
  return <MuiStack {...props} direction={'row'} />
}
