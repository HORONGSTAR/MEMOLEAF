'use client'
import { CommentForm, Dialog, LinkBox, Avatar } from '@/components'
import { useCallback, useMemo, useState } from 'react'
import { ActiveNode, Comment } from '@/lib/types'
import { updateComment } from '@/lib/fetch/feedbackApi'
import { changeDate } from '@/lib/utills'
import { List, ListItem, Box, Typography, IconButton, ListItemText, ListItemAvatar } from '@mui/material'
import { DriveFileRenameOutline, DeleteForever, ExitToApp } from '@mui/icons-material'
import { useSession } from 'next-auth/react'

interface Props {
  comment: Comment
  onDelete: (id: number) => void
}

export default function CommentBox(props: Props) {
  const [comment, setComment] = useState<Comment>(props.comment)
  const [action, setAction] = useState('view')
  const [open, setOpen] = useState(false)
  const { onDelete } = props
  const { data: session } = useSession()
  const myId = session?.user.id

  const active = useMemo(() => (myId === comment.user.id ? 'on' : 'off'), [myId, comment.user.id])

  const onSubmit = useCallback(
    (text: string) => {
      updateComment({ text, id: comment.id })
        .then((result) => setComment((prev) => ({ ...prev, ...result })))
        .catch((err) => console.error(err))
      setAction('view')
    },
    [comment.id]
  )

  const handleDelete = useCallback(() => {
    onDelete(comment.id)
    setAction('remove')
    setOpen(false)
  }, [comment, onDelete])

  const menu = {
    on: (
      <Box my={0.2}>
        <IconButton size="small" aria-label="댓글 수정폼 열기" onClick={() => setAction('edit')}>
          {{ edit: <ExitToApp fontSize="small" />, view: <DriveFileRenameOutline fontSize="small" /> }[action]}
        </IconButton>
        <IconButton size="small" aria-label="댓글 삭제" onClick={() => setOpen(true)}>
          <DeleteForever fontSize="small" />
        </IconButton>
      </Box>
    ),
    off: null,
  }

  const dialogProps = {
    open,
    title: '메모를 삭제할까요?',
    closeLabel: '취소',
    actionLabel: '삭제',
    onClose: () => setOpen(false),
    onAction: handleDelete,
  }

  const components: ActiveNode = {
    view: (
      <Typography px={2} pb={2} variant="body2">
        {comment.text}
      </Typography>
    ),
    edit: (
      <Box sx={{ p: 1 }}>
        <CommentForm onSubmit={onSubmit} {...comment} />
      </Box>
    ),
    remove: (
      <Box sx={{ bgcolor: '#eee', p: 2 }}>
        <Typography color="textDisabled">삭제된 댓글입니다.</Typography>
      </Box>
    ),
  }

  return (
    <>
      <List disablePadding>
        <Box whiteSpace="pre-line">
          <ListItem secondaryAction={menu[active]}>
            <ListItemAvatar>
              <LinkBox link={`/page/my/${comment.user.id}`}>
                <Avatar user={comment.user} size={36} />
              </LinkBox>
            </ListItemAvatar>
            <ListItemText
              primary={
                <LinkBox mr={1} link={`/page/my/${comment.user.id}`}>
                  {comment.user.name}
                </LinkBox>
              }
              secondary={changeDate(comment.createdAt)}
            />
          </ListItem>
          <ListItem divider disablePadding>
            {components[action]}
          </ListItem>
        </Box>
      </List>
      <Dialog {...dialogProps}>
        <Typography>삭제한 메모는 복구할 수 없습니다.</Typography>
      </Dialog>
    </>
  )
}
