'use client'
import { Card as MuiCard, CardContent, CardHeader } from '@mui/material'
import { changeDate } from '@/lib/utills'
import { ReactNode } from 'react'

interface Props {
  children: ReactNode
  header: {
    avatar?: ReactNode
    action?: ReactNode
    title?: string
    subheader?: string
  }
}

export default function Card(props: Props) {
  const { header, children } = props

  return (
    <MuiCard variant="outlined">
      <CardHeader key="header" {...header} subheader={changeDate(header.subheader || '')} />
      <CardContent>{children}</CardContent>
    </MuiCard>
  )
}
