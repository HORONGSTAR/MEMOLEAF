'use client'
import { Divider, Tab, Tabs, Box } from '@mui/material'
import { AsyncBox, MyPostItem } from '@/components'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { useState, useEffect } from 'react'
import { getMemosThunk } from '@/store/slices/memoSlice'

export default function MyPost({ id }: { id: string }) {
  const { memos, status } = useAppSelector((state) => state.memo)
  const dispatch = useAppDispatch()
  const [value, setValue] = useState(0)

  useEffect(() => {
    dispatch(getMemosThunk({ page: 1, userId: id }))
  }, [dispatch, id])

  const labels = ['내 메모', '내 노트', '북마크']

  const panels = labels.map((_, i) => (
    <Box key={`panel${i}`} role={`panel${i}`} id={`panel${i}`} aria-labelledby={`tab${i}`} hidden={value !== i}>
      <MyPostItem posts={memos} />
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
      <AsyncBox state={status}>{panels}</AsyncBox>
    </Box>
  )
}
