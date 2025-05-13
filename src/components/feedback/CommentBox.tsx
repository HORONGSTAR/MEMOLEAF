'use client'
import { CommentForm, MemoBoxHeader, Dialog } from '@/components'
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react'
import { Active, Comment } from '@/lib/types'
import { createComment, deleteComment, getComments, updateComment } from '@/lib/api/feedbackApi'
import { useAppSelector } from '@/store/hooks'
import { swapOnOff } from '@/lib/utills'
import { List, ListItem, Box, Typography, IconButton, Button } from '@mui/material'
import { DriveFileRenameOutline, DeleteForever, ExitToApp } from '@mui/icons-material'

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
  const { profile } = useAppSelector((state) => state.user)
  const [comments, setComments] = useState<Comment[]>([])
  const [mounted, setMounted] = useState(false)
  const { id, active, setCount } = props

  useEffect(() => {
    if (!swapOnOff[active].bool || mounted) return
    getComments({ page: 1 }, id)
      .then((result) => setComments(result.comments))
      .catch((err) => console.error(err))
    setMounted(true)
  }, [mounted, active, id])

  const onSubmit = useCallback(
    (text: string, commentId?: number) => {
      if (!profile) return
      if (commentId !== editId) {
        createComment({ text, id, userId: profile.id })
          .then((result) => {
            const newComment = { ...result, user: profile }
            setComments((prev) => [newComment, ...prev])
            setCount((prev) => ({ ...prev, comments: prev.comments + 1 }))
          })
          .catch((err) => console.error(err))
      } else {
        updateComment({ text, id: editId, userId: profile.id })
          .then((result) => {
            setComments((prev) => prev.map((p) => (p.id !== editId ? p : { ...p, result })))
          })
          .catch((err) => console.error(err))
        setEdit(null)
      }
    },
    [profile, editId, id, setCount]
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
        <IconButton size="small" aria-label="댓글 수정폼 열기" onClick={() => setEdit(editId ? null : id)}>
          {Boolean(editId) ? <ExitToApp fontSize="small" /> : <DriveFileRenameOutline fontSize="small" />}
        </IconButton>
        <IconButton size="small" aria-label="댓글 삭제" onClick={() => setRemove(id)}>
          <DeleteForever fontSize="small" />
        </IconButton>
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
      <Box sx={{ bgcolor: '#eee', p: 2 }}>
        <CommentForm onSubmit={onSubmit} />
      </Box>
      <List disablePadding>
        {comments.map((comment) => (
          <Box key={comment.id} whiteSpace="pre-line">
            <MemoBoxHeader {...comment} variant="list" action={<Action id={comment.id} />} />
            <ListItem divider>
              {editId !== comment.id ? <Typography variant="body2">{comment.text}</Typography> : <CommentForm onSubmit={onSubmit} {...comment} />}
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
