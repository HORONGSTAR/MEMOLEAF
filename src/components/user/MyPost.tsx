'use client'
import { Divider, Box, Tab, Tabs, Stack } from '@mui/material'
import { useState } from 'react'
import { MemoList } from '@/components/memo'
import UserList from './UserList'

interface Props {
  id: number
  lastBookmarkId: number
  lastMyMemoId: number
  name: string
}

export default function MyPost({ id, lastBookmarkId, lastMyMemoId, name }: Props) {
  const [value, setValue] = useState(0)

  const labels = ['게시글', '팔로우', '북마크']

  const mypost = <MemoList lastMemoId={lastMyMemoId} path="my" endpoint={{ mypost: id }} />

  const bookmark = <MemoList lastMemoId={lastBookmarkId} path="my" endpoint={{ bookmark: id }} />
  const follow = <UserList name={name} id={id} />

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
      {labels.map((_, i) => (
        <Box key={`panel${i}`} role={`panel${i}`} id={`panel${i}`} aria-labelledby={`tab${i}`} hidden={value !== i}>
          <Stack spacing={2}>{[mypost, bookmark, follow][i]}</Stack>
        </Box>
      ))}
    </Box>
  )
}
