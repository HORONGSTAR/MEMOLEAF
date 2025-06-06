'use client'
import { Typography, ListItem, ListItemText, Avatar, ListItemAvatar } from '@mui/material'
import { MoreHoriz, DeleteOutline, EditOutlined } from '@mui/icons-material'
import { useCallback, useState } from 'react'
import { DecoBox, ImgGrid } from '@/components/memo/sub'
import { checkOnOff, convertDate, imgPath } from '@/shared/utils/common'
import { deleteMemo } from '@/shared/fetch/memosApi'
import { MemoData } from '@/shared/types/client'
import MemoMenu from '@/components/memo/MemoMenu'
import DialogBox from '@/components/common/DialogBox'
import LinkBox from '../common/LinkBox'
import { useAppDispatch } from '@/store/hooks'
import { openAlert } from '@/store/slices/alertSlice'

interface Props {
  leaf: MemoData
  myId: number
  edit: () => void
  remove: () => void
}

export default function LeafBox({ leaf, myId, edit, remove }: Props) {
  const [open, setOpen] = useState(false)
  const isMine = checkOnOff(leaf.user.id, myId || 0)

  const dispatch = useAppDispatch()
  const handleDelete = useCallback(() => {
    deleteMemo(leaf.id)
      .then(() => {
        remove()
        dispatch(openAlert({ message: '메모를 삭제했습니다.' }))
      })
      .catch((error) => {
        console.error(error)
        dispatch(openAlert({ message: '메모 삭제 중 문제가 발생했습니다.', severity: 'error' }))
      })
      .finally(() => setOpen(false))
  }, [dispatch, leaf.id, remove])

  const memu = (
    <MemoMenu
      icon={<MoreHoriz fontSize="small" />}
      label="더 보기"
      items={[
        { active: 'on', label: '글 수정', icon: <EditOutlined />, onClick: edit },
        { active: 'on', label: '삭제', icon: <DeleteOutline />, onClick: () => setOpen(true) },
      ]}
    />
  )

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
      <DecoBox decos={leaf.decos}>
        <ListItem dense secondaryAction={{ on: memu, off: null }[isMine]}>
          <ListItemAvatar>
            <LinkBox link={`/page/profile/${leaf.user.id}`}>
              <Avatar src={imgPath + leaf.user.image} alt={leaf.user.name} />
            </LinkBox>
          </ListItemAvatar>
          <ListItemText
            primary={<LinkBox link={`/page/profile/${leaf.user.id}`}>{leaf.user?.name}</LinkBox>}
            secondary={convertDate(leaf.createdAt)}
          />
        </ListItem>
        <ListItem dense>{leaf.content}</ListItem>
        <ListItem dense divider>
          <ImgGrid images={leaf.images} />
        </ListItem>
      </DecoBox>

      <DialogBox {...dialogProps}>
        <Typography>삭제한 메모는 복구할 수 없습니다.</Typography>
      </DialogBox>
    </>
  )
}
