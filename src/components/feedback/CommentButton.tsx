'use client'
import { Close, ForumOutlined } from '@mui/icons-material'
import { Box, IconButton, Dialog, Pagination, Stack, DialogContent, DialogTitle, DialogActions, useMediaQuery, Skeleton } from '@mui/material'
import CommentBox from './CommentBox'
import CommentForm from './CommentForm'
import FeedbackCount from './FeedbackCount'
import { useCallback, useEffect, useState } from 'react'
import { OnOff, CommentData } from '@/lib/types'
import { createComment, deleteComment, getComments } from '@/lib/fetch/feedbackApi'
import { swapOnOff } from '@/lib/utills'
import { theme } from '@/styles/MuiTheme'
import { useAppSelector } from '@/store/hooks'

interface Props {
  count?: number
  id: number
}
export default function CommentButton({ id, count }: Props) {
  const { profile } = useAppSelector((state) => state.profile)
  const [loading, setLoading] = useState('off')
  const [comments, setComments] = useState<CommentData[]>([])
  const [total, setTotal] = useState(count || 0)
  const [active, setActive] = useState<OnOff>('off')
  const [page, setPage] = useState(1)
  const limit = 5
  const totalPage = Math.ceil(total / limit)

  const isMobile = useMediaQuery(theme.breakpoints.down('xs'))

  useEffect(() => {
    if (!swapOnOff[active].bool) return
    setLoading('on')
    getComments({ page, limit }, id)
      .then((result) => setComments(result.comments))
      .catch((err) => console.error(err))
      .finally(() => setLoading('off'))
  }, [active, page, id])

  const onSubmit = useCallback(
    (text: string) => {
      createComment({ text, id })
        .then((result) => {
          const newComment = { ...result, user: profile }
          setComments((prev) => [newComment, ...prev])
          setTotal((prev) => prev + 1)
        })
        .catch((err) => console.error(err))
    },
    [id, profile]
  )

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value)
  }

  const handleDelete = useCallback((id: number) => {
    deleteComment(id)
    setTotal((prev) => prev - 1)
    setComments((prev) => prev.filter((p) => p.id !== id))
  }, [])

  return (
    <>
      <FeedbackCount count={total}>
        <IconButton aria-label="댓글창 열기" onClick={() => setActive('on')}>
          <ForumOutlined fontSize="small" />
        </IconButton>
      </FeedbackCount>

      <Dialog scroll="paper" open={swapOnOff[active].bool} fullWidth fullScreen={isMobile} onClose={() => setActive('off')}>
        <DialogTitle>
          <Stack direction="row" alignItems="center">
            댓글창
            <Box flexGrow={1} />
            <IconButton onClick={() => setActive('off')} aria-label="닫기">
              <Close />
            </IconButton>
          </Stack>
        </DialogTitle>
        <Box sx={{ bgcolor: '#eee', p: 1, minWidth: { sx: 480, xs: 300 } }}>
          <CommentForm onSubmit={onSubmit} />
        </Box>
        <DialogContent>
          {
            {
              on: (
                <Stack py={2} spacing={1}>
                  <Skeleton />
                  <Skeleton />
                  <Skeleton />
                </Stack>
              ),
              off: null,
            }[loading]
          }
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
