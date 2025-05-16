'use client'
import { Divider, Tab, Tabs, Box, BoxProps } from '@mui/material'
import { MemoIndex } from '@/components'
import { useState } from 'react'
import { Memo } from '@/lib/types'

interface Props {
  id: string
  posts: Memo[]
  total: number
}

export default function MyPost(props: Props) {
  const [value, setValue] = useState(0)
  const { id, posts, total } = props

  const labels = ['내 메모']
  const Panels = (props: BoxProps) =>
    labels.map((_, i) => <Box key={`panel${i}`} role={`panel${i}`} id={`panel${i}`} aria-labelledby={`tab${i}`} hidden={value !== i} {...props} />)

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
      <Panels mt={2}>
        <MemoIndex memos={posts} total={total} queryString={{ userId: id }} />
      </Panels>
    </Box>
  )
}
