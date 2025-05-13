'use client'
import { Link as MuiLink } from '@mui/material'
import { ReactNode } from 'react'
import Link from 'next/link'

interface Props {
  link: string
  children: ReactNode
}

export default function LinkBox(props: Props) {
  const { link, children } = props

  return (
    <MuiLink variant="body2" fontWeight={500} component={Link} href={link} underline="hover">
      {children}
    </MuiLink>
  )
}
