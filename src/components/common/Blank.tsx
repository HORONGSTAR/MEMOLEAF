'use client'
import { Box, BoxProps } from '@mui/material'

export default function Blank(props: BoxProps) {
  return <Box {...props} flexGrow={1} />
}
