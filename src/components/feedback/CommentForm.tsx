'use client'
import { Box, Chip, Paper, Snackbar, Stack, InputBase } from '@mui/material'
import { useCallback, useState } from 'react'
import TextCount from '@/components/common/TextCount'

interface CommentFormData {
  id?: number
  text?: string
  userId?: number
  onSubmit: (text: string, id?: number) => void
}

export default function CommentForm(inti: CommentFormData) {
  const [message, setMessage] = useState('')
  const [text, setText] = useState(inti.text || '')
  const { onSubmit, id } = inti

  const handleSubmit = useCallback(() => {
    if (!text) return setMessage('내용을 입력해주세요.')
    onSubmit(text, id)
    setText('')
  }, [onSubmit, text, id])

  return (
    <Stack spacing={1} alignItems="end">
      <Paper variant="outlined" sx={{ width: '100%', p: 1 }}>
        <InputBase
          fullWidth
          aria-label="댓글 글자수 제한 191자"
          placeholder="메모에 댓글을 남길 수 있어요."
          multiline
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </Paper>
      <Box>
        <TextCount text={text} max={191} />
        <Chip sx={{ bgcolor: '#ccc', fontWeight: 500 }} onClick={handleSubmit} label={id ? '수정 완료' : '댓글 쓰기'} />
      </Box>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={message ? true : false}
        autoHideDuration={6000}
        onClose={() => setMessage('')}
        message={message}
      />
    </Stack>
  )
}
