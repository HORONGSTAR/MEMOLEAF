'use client'
import { Snackbar, Typography, ListItem, ListItemAvatar, ListItemText, Box } from '@mui/material'
import { MoreHoriz, DeleteOutline, EditOutlined, LinkOutlined, Launch } from '@mui/icons-material'
import { useCallback, useMemo, useState } from 'react'
import { BookmarkButton, CommentButton } from '@/components/feedback'
import { Avatar, Menu, Dialog, LinkBox } from '@/components/common'
import { checkOnOff, convertDate } from '@/shared/utils/common'
import { DecoBox, ImgGrid } from '@/components/memo/sub'
import { deleteMemo } from '@/shared/fetch/memosApi'
import { useRouter } from 'next/navigation'
import { MemoData } from '@/shared/types/client'

interface Props {
  memo: MemoData
  myId?: number
  editItem: () => void
  removeItem: () => void
}

export default function MemoBox({ memo, myId, editItem, removeItem }: Props) {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const isMine = checkOnOff(memo.user.id, myId || 0)
  const router = useRouter()

  const handleDelete = useCallback(() => {
    deleteMemo(memo.id)
    setOpen(false)
    removeItem()
  }, [memo, removeItem])

  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      return '링크를 클립보드에 복사했습니다.'
    } catch (err) {
      console.error('복사 실패:', err)
      return '링크 복사하는 중 문제가 발생했습니다.'
    }
  }

  const handleCopy = useCallback(async () => {
    const url = `${window.location.origin}/page/detail/${memo.id}`
    const reuslt = copyText(url)
    setMessage(await reuslt)
  }, [memo])

  const memu = (
    <Menu
      icon={<MoreHoriz fontSize="small" />}
      label="더 보기"
      items={[
        { active: isMine, label: '글 수정', icon: <EditOutlined />, onClick: editItem },
        { active: isMine, label: '삭제', icon: <DeleteOutline />, onClick: () => setOpen(true) },
        { active: 'on', label: '공유하기', icon: <LinkOutlined />, onClick: () => handleCopy() },
        { active: 'on', label: '단독 페이지로 보기', icon: <Launch />, onClick: () => router.push(`/page/detail/${memo.id}`) },
      ]}
    />
  )

  const bookmarkProps = useMemo(() => {
    const isMyBookmark = checkOnOff(1, memo.bookmarks.length || 0)
    const id = { on: memo.bookmarks[0]?.id || 0, off: memo.id }[isMyBookmark]
    const checked = isMyBookmark
    return { id, checked }
  }, [memo])

  const dialogProps = {
    open,
    title: '메모를 삭제할까요?',
    closeLabel: '취소',
    actionLabel: '삭제',
    onClose: () => setOpen(false),
    onAction: handleDelete,
  }

  return (
    <>
      <Box sx={{ p: 1 }}>
        <ListItem secondaryAction={memu}>
          <ListItemAvatar>
            <LinkBox link={`/page/my/${memo.user.id}`}>
              <Avatar user={memo.user} size={36} />
            </LinkBox>
          </ListItemAvatar>
          <ListItemText primary={<LinkBox link={`/page/my/${memo.user.id}`}>{memo.user?.name}</LinkBox>} secondary={convertDate(memo.createdAt)} />
        </ListItem>
        <DecoBox decos={memo.decos}>
          <ListItem>{memo.content}</ListItem>
          <ImgGrid images={memo.images} />
        </DecoBox>
        <ListItem>
          <ListItemText />
          <BookmarkButton {...bookmarkProps} count={memo._count?.bookmarks || 0} />
          <CommentButton id={memo.id} count={memo._count?.comments || 0} />
        </ListItem>
      </Box>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={message ? true : false}
        autoHideDuration={6000}
        onClose={() => setMessage('')}
        message={message}
      />
      <Dialog {...dialogProps}>
        <Typography>삭제한 메모는 복구할 수 없습니다.</Typography>
      </Dialog>
    </>
  )
}
