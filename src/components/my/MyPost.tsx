'use client'
import { Divider, Tab, Tabs, Box, Stack } from '@mui/material'
import { InfoNote } from '@/components'
import { ReactNode, useState } from 'react'

interface Props {
  children: ReactNode
}

export default function MyPost(props: Props) {
  const [value, setValue] = useState(0)
  const { children } = props

  const labels = ['게시글', '팔로우', '북마크']

  const follower = <InfoNote />
  const following = <InfoNote />

  const panels = labels.map((_, i) => (
    <Box key={`panel${i}`} role={`panel${i}`} id={`panel${i}`} aria-labelledby={`tab${i}`} hidden={value !== i}>
      <Stack spacing={2}>{[follower, following][i]}</Stack>
    </Box>
  ))

  return (
    <Box sx={{ width: '100%' }}>
      <Box>
        <Tabs value={value} onChange={(_, newValue) => setValue(newValue)} aria-label="모아보기">
          {labels.map((label, i) => (
            <Tab key={`tab${i}`} label={label} id={`tab${i}`} aria-controls={`panel${i}`} />
          ))}
        </Tabs>
      </Box>
      <Divider />
      {panels}
      {children}
    </Box>
  )
}
