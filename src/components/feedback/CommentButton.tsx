'use client'
import { ForumOutlined } from '@mui/icons-material'
import { Box, Pagination, Stack, Typography } from '@mui/material'
import { CommentBox, Bubble, CommentForm } from '@/components'
import { ReactNode, useCallback, useEffect, useState } from 'react'
import { OnOff, UserData, CommentData } from '@/lib/types'
import { createComment, deleteComment, getComments } from '@/lib/fetch/feedbackApi'
import { swapOnOff } from '@/lib/utills'

interface Props {
  count: number
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
    <Bubble
      label="댓글창"
      icon={
        <>
          <ForumOutlined fontSize="small" />
          <Typography variant="body2" sx={{ position: 'absolute', right: -2, fontWeight: 'bold' }}>
            {count}
          </Typography>
        </>
      }
      addEvent={() => setActive('on')}
    >
      <Box sx={{ bgcolor: '#eee', p: 1 }}>
        <CommentForm onSubmit={onSubmit} />
      </Box>

      {comments.map((comment) => (
        <CommentBox key={'comment' + comment.id} onDelete={handleDelete} comment={comment} />
      ))}
      <Stack spacing={2} alignItems="center" py={2}>
        <Pagination size="small" count={totalPage} page={page} onChange={handleChange} />
      </Stack>
    </Bubble>
  )
}
