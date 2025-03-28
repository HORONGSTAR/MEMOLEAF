import { Container, Stack, GridSpacing, StackProps, Box, BoxProps, Breakpoint } from '@mui/material'
import { ReactNode } from 'react'

interface Props {
   spacing?: GridSpacing
   maxWidth?: Breakpoint
   children?: ReactNode
   imgUrl?: string
}

export const Wrap = (props: Props) => {
   return (
      <Container maxWidth={props.maxWidth} sx={{ p: 2 }}>
         <Stack spacing={props.spacing}>{props.children}</Stack>
      </Container>
   )
}

export const Stack2 = (props: StackProps) => {
   return <Stack {...props} direction={'row'} />
}

export const Blank = (props: BoxProps) => {
   return <Box {...props} flexGrow={1} />
}
