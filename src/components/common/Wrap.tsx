import { Container, Stack } from '@mui/material'
import { Props } from '@/lib/types'

export default function Wrap(props: Props) {
  return (
    <Container maxWidth={props.maxWidth} sx={{ p: 2 }}>
      <Stack spacing={props.spacing}>{props.children}</Stack>
    </Container>
  )
}
