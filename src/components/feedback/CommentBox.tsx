'use client'
import { List, ListItem, Box, Typography, IconButton, ListItemText, ListItemAvatar, Snackbar } from '@mui/material'
import { DriveFileRenameOutline, DeleteForever, ExitToApp } from '@mui/icons-material'
import { Dialog, LinkBox, Avatar } from '@/components/common'
import { convertDate, checkOnOff } from '@/shared/utils/common'
import { useCallback, useState } from 'react'
import { updateComment } from '@/shared/fetch/commentsApi'
import { CommentForm } from '@/components/feedback'
import { CommentData } from '@/shared/types/client'
import { useSession } from 'next-auth/react'

interface Props {
  comment: CommentData
  onDelete: (id: number) => void
}

export default function CommentBox(props: Props) {
  const [comment, setComment] = useState<CommentData>(props.comment)
  const [action, setAction] = useState('view')
  const [open, setOpen] = useState(false)
  const { onDelete } = props
  const { data: session } = useSession()
  const myId = session?.user.id
  const isMine = checkOnOff(comment.user.id, myId || 0)
  const [message, setMessage] = useState('')

  const onSubmit = useCallback(
    (text: string) => {
      updateComment({ text, id: comment.id })
        .then((result) => {
          setComment((prev) => ({ ...prev, ...result }))
          setMessage('댓글을 작성했습니다.')
        })
        .catch(() => setMessage('댓글을 작성 중 문제가 생겼습니다.'))
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
        {
          {
            view: (
              <IconButton size="small" aria-label="댓글 수정폼 열기" onClick={() => setAction('edit')}>
                <DriveFileRenameOutline fontSize="small" />
              </IconButton>
            ),
            edit: (
              <IconButton size="small" aria-label="댓글 수정폼 닫기" onClick={() => setAction('view')}>
                <ExitToApp fontSize="small" />
              </IconButton>
            ),
          }[action]
        }
        <IconButton size="small" aria-label="댓글 삭제" onClick={() => setOpen(true)}>
          <DeleteForever fontSize="small" />
        </IconButton>
      </Box>
    ),
    off: null,
  }[isMine]

  const dialogProps = {
    open,
    title: '메모를 삭제할까요?',
    closeLabel: '취소',
    actionLabel: '삭제',
    onClose: () => setOpen(false),
    onAction: handleDelete,
  }

  const components = {
    view: (
      <Typography px={2} pb={2} variant="body2">
        {comment.text}
      </Typography>
    ),
    edit: (
      <Box sx={{ py: 1, width: '100%' }}>
        <CommentForm onSubmit={onSubmit} {...comment} />
      </Box>
    ),
    remove: (
      <Box sx={{ bgcolor: '#eee', p: 2 }}>
        <Typography color="textDisabled">삭제된 댓글입니다.</Typography>
      </Box>
    ),
  }[action]

  return (
    <>
      <List disablePadding>
        <Box whiteSpace="pre-line">
          <ListItem secondaryAction={menu}>
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
              secondary={convertDate(comment.createdAt)}
            />
          </ListItem>
          <ListItem divider disablePadding>
            {components}
          </ListItem>
        </Box>
      </List>
      <Dialog {...dialogProps}>
        <Typography>삭제한 메모는 복구할 수 없습니다.</Typography>
      </Dialog>
      <Snackbar open={message ? true : false} autoHideDuration={6000} onClose={() => setMessage('')} message={message} />
    </>
  )
}
