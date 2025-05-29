'use client'
import { Snackbar, Typography, ListItem, ListItemAvatar, ListItemText, Avatar } from '@mui/material'
import { MoreHoriz, DeleteOutline, EditOutlined, LinkOutlined } from '@mui/icons-material'
import { ReactNode, useCallback, useMemo, useState } from 'react'
import { BookmarkButton, CommentButton } from '@/components/feedback'
import { checkOnOff, convertDate, imgPath } from '@/shared/utils/common'
import { DecoBox, ImgGrid } from '@/components/memo/sub'
import { deleteMemo } from '@/shared/fetch/memosApi'
import { MemoData } from '@/shared/types/client'
import MemoMenu from '@/components/memo/MemoMenu'
import LinkBox from '@/components/common/LinkBox'
import DialogBox from '@/components/common/DialogBox'

interface Props {
  myId: number
  memo: MemoData
  theardButton?: ReactNode
  edit: () => void
  remove: () => void
}

export default function MemoBox({ memo, myId, theardButton, edit, remove }: Props) {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const isMine = checkOnOff(memo.user.id, myId)

  const handleDelete = useCallback(() => {
    deleteMemo(memo.id)
    setOpen(false)
    remove()
  }, [memo, remove])

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
    <MemoMenu
      icon={<MoreHoriz fontSize="small" />}
      label="더 보기"
      items={[
        { active: isMine, label: '글 수정', icon: <EditOutlined />, onClick: edit },
        { active: isMine, label: '삭제', icon: <DeleteOutline />, onClick: () => setOpen(true) },
        { active: 'on', label: '공유하기', icon: <LinkOutlined />, onClick: () => handleCopy() },
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

  const isThread = checkOnOff(0, memo._count?.leafs || 0)
  const threadCount = { off: `${memo._count?.leafs}개의 타래글`, on: null }[isThread]

  return (
    <>
      <ListItem secondaryAction={memu}>
        <ListItemAvatar>
          <LinkBox link={`/page/profile/${memo.user.id}`}>
            <Avatar src={imgPath + memo.user.image} alt={memo.user.name} />
          </LinkBox>
        </ListItemAvatar>
        <ListItemText primary={<LinkBox link={`/page/profile/${memo.user.id}`}>{memo.user?.name}</LinkBox>} secondary={convertDate(memo.createdAt)} />
      </ListItem>
      <DecoBox decos={memo.decos}>
        <ListItem>{memo.content}</ListItem>
        <ListItem dense>
          <ImgGrid images={memo.images} />
        </ListItem>
      </DecoBox>
      <ListItem>
        <ListItemText>
          <Typography variant="button" color="textSecondary">
            {theardButton ? theardButton : threadCount}
          </Typography>
        </ListItemText>
        <BookmarkButton {...bookmarkProps} count={memo._count?.bookmarks || 0} />
        <CommentButton id={memo.id} count={memo._count?.comments || 0} />
      </ListItem>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={message ? true : false}
        autoHideDuration={6000}
        onClose={() => setMessage('')}
        message={message}
      />
      <DialogBox {...dialogProps}>
        <Typography>삭제한 메모는 복구할 수 없습니다.</Typography>
      </DialogBox>
    </>
  )
}
