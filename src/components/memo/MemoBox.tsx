'use client'
import { Snackbar, Typography, ListItem, ListItemAvatar, ListItemText, Avatar } from '@mui/material'
import { MoreHoriz, DeleteOutline, EditOutlined, LinkOutlined } from '@mui/icons-material'
import { useCallback, useState } from 'react'
import { BookmarkToggle, FavoriteToggle, FeedbackCount } from '@/components/feedback'
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
  edit: () => void
  remove: () => void
  updateItem: (item: MemoData) => void
}

export default function MemoBox({ memo, myId, edit, remove, updateItem }: Props) {
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

  const handleUpdateCount = useCallback(
    (value: { id: number } | undefined, action: 'add' | 'remove', field: 'bookmarks' | 'favorites') => {
      updateItem({
        ...memo,
        [field]: value,
        _count: { ...memo._count, [field]: memo._count[field] + { add: 1, remove: -1 }[action] },
      })
    },
    [memo, updateItem]
  )

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

  const bookmarkProps = memo.bookmarks ? { id: memo.bookmarks.id, checked: 'on' } : { id: memo.id, checked: 'off' }

  const favoriteProps = memo.favorites ? { id: memo.favorites.id, checked: 'on' } : { id: memo.id, checked: 'off' }

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
      <ListItem secondaryAction={memu}>
        <ListItemAvatar>
          <LinkBox link={`/page/profile/${memo.user.id}`}>
            <Avatar src={imgPath + memo.user.image} alt={memo.user.name} />
          </LinkBox>
        </ListItemAvatar>
        <ListItemText primary={<LinkBox link={`/page/profile/${memo.user.id}`}>{memo.user?.name}</LinkBox>} secondary={'ID ' + memo.user.userNum} />
      </ListItem>
      <DecoBox decos={memo.decos}>
        <ListItem>{memo.content}</ListItem>
        <ListItem dense>
          <ImgGrid images={memo.images} />
        </ListItem>
      </DecoBox>
      <ListItem>
        <ListItemText secondary={convertDate(memo.createdAt)} />

        <FeedbackCount count={memo._count.bookmarks}>
          <BookmarkToggle {...bookmarkProps} update={(value, action) => handleUpdateCount(value, action, 'bookmarks')} />
        </FeedbackCount>
        <FeedbackCount count={memo._count.favorites}>
          <FavoriteToggle {...favoriteProps} update={(value, action) => handleUpdateCount(value, action, 'favorites')} />
        </FeedbackCount>
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
