'use client'
import { Card as MuiCard, CardContent, CardHeader, CardActions, CardMedia } from '@mui/material'
import { changeDate } from '@/lib/utills'
import { ReactNode } from 'react'

type Item = 'header' | 'action' | 'media'

interface Props {
  children: ReactNode
  items: Item[]
  header: {
    avatar: ReactNode | null
    action: ReactNode | null
    title: string | null
    subheader: string | ''
  }
}

export default function Card(props: Props) {
  const { header, children, items } = props
  const components = {
    header: <CardHeader key="header" {...header} subheader={changeDate(header.subheader)} />,
    action: <CardActions key="action"></CardActions>,
    media: <CardMedia key="media" />,
  }

  return (
    <MuiCard variant="outlined">
      {items.map((item) => components[item])}
      <CardContent>{children}</CardContent>
    </MuiCard>
  )
}
