'use client'
import { Link as MuiLink, LinkProps } from '@mui/material'
import Link from 'next/link'

interface Props extends LinkProps {
  link: string
}

export default function LinkBox(props: Props) {
  const { link } = props

  return <MuiLink variant="body2" fontWeight={500} component={Link} href={link} underline="hover" {...props} />
}
