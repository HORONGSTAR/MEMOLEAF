'use client'
import { Box, Chip, Stack } from '@mui/material'
import { Card, InputText } from '@/components'
import { useCallback, useState } from 'react'

interface CommentFormData {
  id?: number
  text?: string
  userId?: number
  onSubmit: (text: string, id?: number) => void
}

export default function CommentForm(inti: CommentFormData) {
  const [text, setText] = useState(inti.text || '')
  const { onSubmit, id } = inti

  const handleSubmit = useCallback(() => {
    onSubmit(text, id)
    setText('')
  }, [onSubmit, text, id])

  return (
    <Stack spacing={1} alignItems="end">
      <Card sx={{ p: 1, width: '100%' }}>
        <InputText
          fullWidth
          fontSize="body2"
          placeholder="메모에 댓글을 남길 수 있어요."
          multiline
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </Card>
      <Box>
        <Chip
          sx={{ bgcolor: '#ccc', fontWeight: 500 }}
          onClick={handleSubmit}
          label={id ? '수정 완료' : '댓글 쓰기'}
          disabled={!text || inti.text === text}
        />
      </Box>
    </Stack>
  )
}
