'use client'
import { InputBase, Paper, Button, Typography, IconButton } from '@mui/material'
import { Blank, Stack2 } from '@/styles/BaseStyles'
import { useCallback, useState } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { createMemoThunk } from '@/store/slices/postSlice'
import { useSession } from 'next-auth/react'
import { IntiVal } from '@/lib/types'
import { ImageSearch } from '@mui/icons-material'

export const PostForm = (inti: IntiVal) => {
  const dispatch = useAppDispatch()

  const [content, setContent] = useState(inti.content || '')
  const [length, setLength] = useState(inti.content?.length || 0)
  const { data: session } = useSession()
  const user = session?.user

  const handleChange = (value: string) => {
    if (value.length > 191) return
    setContent(value)
    setLength(value.length)
  }

  const handleSubmit = useCallback(() => {
    if (!user?.id) return
    if (inti.id && inti.onSubmit) {
      inti.onSubmit(inti.id, content)
    } else {
      dispatch(createMemoThunk({ userId: user.id, content }))
      setContent('')
      setLength(0)
    }
  }, [dispatch, inti, user, content])

  return (
    <Paper variant="outlined" sx={{ p: 2, minHeight: 120 }}>
      <InputBase
        fullWidth
        multiline
        autoFocus
        minRows={3}
        value={content}
        placeholder={'기록을 남겨보세요!'}
        onChange={(e) => handleChange(e.target.value)}
      />
      <Stack2 alignItems={'center'} spacing={2}>
        <IconButton>
          <ImageSearch />
        </IconButton>
        <Blank />
        <Typography variant="body2">{length} / 191</Typography>
        <Button variant="contained" onClick={handleSubmit}>
          메모
        </Button>
      </Stack2>
    </Paper>
  )
}
