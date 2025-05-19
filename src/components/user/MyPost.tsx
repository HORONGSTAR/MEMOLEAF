'use client'
import { Divider, Tab, Tabs, Box, Stack } from '@mui/material'
import { ReactNode, useState } from 'react'
import { MyPostItem } from '@/components'

interface Props {
  id: number
  children: ReactNode
}

export default function MyPost({ id, children }: Props) {
  const [value, setValue] = useState(0)
  const labels = ['게시글', '북마크', '팔로우']

  const items: { [key: number]: ReactNode } = {
    0: <MyPostItem endpoint={{ mypost: id }} />,
    1: <MyPostItem endpoint={{ bookmark: id }} />,
    2: children,
  }

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
      <Box key={`panel${value}`} role={`panel${value}`} id={`panel${value}`} aria-labelledby={`tab${value}`} hidden={value !== value} pt={2}>
        <Stack spacing={2}>{items[value]}</Stack>
      </Box>
    </Box>
  )
}
