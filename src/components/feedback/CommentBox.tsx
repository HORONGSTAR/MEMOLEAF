'use client'
import { CommentForm, MemoHeader, Dialog } from '@/components'
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react'
import { Active, Comment } from '@/lib/types'
import { createComment, deleteComment, getComments, updateComment } from '@/lib/api/feedbackApi'
import { useAppSelector } from '@/store/hooks'
import { swapOnOff } from '@/lib/utills'
import { List, ListItem, Box, Typography, IconButton, Button, Stack } from '@mui/material'
import { DriveFileRenameOutline, DeleteForever, ExitToApp } from '@mui/icons-material'
import { useSession } from 'next-auth/react'

interface Props {
  id: number
  active: Active
  setCount: Dispatch<
    SetStateAction<{
      comments: number
      bookmarks: number
    }>
  >
}

export default function CommentBox(props: Props) {
  const [removeId, setRemove] = useState<null | number>(null)
  const [editId, setEdit] = useState<null | number>(null)
  const { user } = useAppSelector((state) => state.auth)
  const [comments, setComments] = useState<Comment[]>([])
  const [mounted, setMounted] = useState(false)
  const { id, active, setCount } = props
  const { data: session } = useSession()
  const auth = session?.user

  useEffect(() => {
    if (!swapOnOff[active].bool || mounted) return
    getComments({ page: 1 }, id)
      .then((result) => setComments(result.comments))
      .catch((err) => console.error(err))
    setMounted(true)
  }, [mounted, active, id])

  const onSubmit = useCallback(
    (text: string, commentId?: number) => {
      if (!user) return
      if (commentId !== editId) {
        createComment({ text, id, userId: user.id })
          .then((result) => {
            const newComment = { ...result, user }
            setComments((prev) => [newComment, ...prev])
            setCount((prev) => ({ ...prev, comments: prev.comments + 1 }))
          })
          .catch((err) => console.error(err))
      } else {
        updateComment({ text, id: editId, userId: user.id })
          .then((result) => {
            setComments((prev) => prev.map((p) => (p.id !== editId ? p : { ...p, result })))
          })
          .catch((err) => console.error(err))
        setEdit(null)
      }
    },
    [user, editId, id, setCount]
  )

  const handleDelete = useCallback(() => {
    if (!removeId) return
    deleteComment(removeId)
      .then(() => {
        setComments((prev) => prev.filter((p) => p.id !== removeId))
        setCount((prev) => ({ ...prev, comments: prev.comments - 1 }))
      })
      .catch((err) => console.error(err))
    setRemove(null)
  }, [removeId, setCount])

  const Action = ({ id }: { id: number }) => {
    return (
      <>
        <Box my={0.2}>
          <IconButton size="small" aria-label="댓글 수정폼 열기" onClick={() => setEdit(editId ? null : id)}>
            {Boolean(editId) ? <ExitToApp fontSize="small" /> : <DriveFileRenameOutline fontSize="small" />}
          </IconButton>
        </Box>
        <Box m={0.2}>
          <IconButton size="small" aria-label="댓글 삭제" onClick={() => setRemove(id)}>
            <DeleteForever fontSize="small" />
          </IconButton>
        </Box>
      </>
    )
  }

  const removeAction = (
    <>
      <Button onClick={() => setRemove(null)}>취소</Button>
      <Button color="error" onClick={handleDelete}>
        삭제
      </Button>
    </>
  )

  return (
    <>
      <Box sx={{ bgcolor: '#eee', p: 1 }}>
        <CommentForm onSubmit={onSubmit} />
      </Box>
      <List disablePadding>
        {comments.map((comment) => (
          <Box key={comment.id} whiteSpace="pre-line">
            <Stack direction="row" justifyContent="space-between">
              <MemoHeader {...comment} variant="list" />
              {auth?.id === comment.user.id && <Action id={comment.id} />}
            </Stack>
            <ListItem divider disablePadding>
              {editId !== comment.id ? (
                <Typography px={2} pb={2} variant="body2">
                  {comment.text}
                </Typography>
              ) : (
                <Box sx={{ p: 1 }}>
                  <CommentForm onSubmit={onSubmit} {...comment} />
                </Box>
              )}
            </ListItem>
          </Box>
        ))}
      </List>
      <Dialog open={Boolean(removeId)} actions={removeAction}>
        댓글을 삭제할까요?
      </Dialog>
    </>
  )
}
