'use client'
import { Close, ForumOutlined } from '@mui/icons-material'
import { Box, IconButton, Dialog, Pagination, Stack, Typography, DialogContent, DialogTitle, DialogActions, useMediaQuery } from '@mui/material'
import { Blank, CommentBox, CommentForm } from '@/components'
import { ReactNode, useCallback, useEffect, useState } from 'react'
import { OnOff, UserData, CommentData } from '@/lib/types'
import { createComment, deleteComment, getComments } from '@/lib/fetch/feedbackApi'
import { swapOnOff } from '@/lib/utills'
import { theme } from '@/styles/MuiTheme'

interface Props {
  count?: number
  children?: ReactNode
  id: number
  user: UserData
}
export default function CommentButton(props: Props) {
  const [comments, setComments] = useState<CommentData[]>([])
  const [count, setCount] = useState(props.count || 0)
  const [active, setActive] = useState<OnOff>('off')
  const { id, user } = props
  const [page, setPage] = useState(1)
  const limit = 5
  const totalPage = Math.ceil(count / limit)

  const isMobile = useMediaQuery(theme.breakpoints.down('xs'))

  useEffect(() => {
    if (!swapOnOff[active].bool) return
    getComments({ page, limit }, id)
      .then((result) => setComments(result.comments))
      .catch((err) => console.error(err))
  }, [active, page, id])

  const onSubmit = useCallback(
    (text: string) => {
      createComment({ text, id })
        .then((result) => {
          const newComment = { ...result, user }
          setComments((prev) => [newComment, ...prev])
          setCount((prev) => prev + 1)
        })
        .catch((err) => console.error(err))
    },
    [user, id, setCount]
  )

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value)
  }

  const handleDelete = useCallback((id: number) => {
    deleteComment(id)
    setCount((prev) => prev - 1)
    setComments((prev) => prev.filter((p) => p.id !== id))
  }, [])

  return (
    <>
      <IconButton aria-label="댓글창 열기" onClick={() => setActive('on')}>
        <ForumOutlined fontSize="small" />
        <Typography variant="body2" sx={{ position: 'absolute', right: -2, fontWeight: 'bold' }}>
          {count}
        </Typography>
      </IconButton>
      <Dialog scroll="paper" open={swapOnOff[active].bool} fullWidth fullScreen={isMobile} onClose={() => setActive('off')}>
        <DialogTitle>
          <Stack direction="row" alignItems="center">
            댓글창
            <Blank />
            <IconButton onClick={() => setActive('off')} aria-label="닫기">
              <Close />
            </IconButton>
          </Stack>
        </DialogTitle>
        <Box sx={{ bgcolor: '#eee', p: 1, minWidth: { sx: 480, xs: 300 } }}>
          <CommentForm onSubmit={onSubmit} />
        </Box>
        <DialogContent>
          {comments.map((comment) => (
            <CommentBox key={'comment' + comment.id} onDelete={handleDelete} comment={comment} />
          ))}
        </DialogContent>
        <DialogActions>
          <Stack spacing={2} alignItems="center" py={2}>
            <Pagination size="small" count={totalPage} page={page} onChange={handleChange} />
          </Stack>
        </DialogActions>
      </Dialog>
    </>
  )
}
