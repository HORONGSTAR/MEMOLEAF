'use client'
import { Snackbar, Typography, ListItem, ListItemText, ListItemIcon } from '@mui/material'
import { MoreHoriz, DeleteOutline, EditOutlined } from '@mui/icons-material'
import { ReactNode, useCallback, useState } from 'react'
import { DecoBox, ImgGrid } from '@/components/memo/sub'
import { Menu, Dialog } from '@/components/common'
import { convertDate } from '@/shared/utils/common'
import { deleteMemo } from '@/shared/fetch/memosApi'
import { LeafData } from '@/shared/types/client'

interface Props {
  memo: LeafData
  children: ReactNode

  isMine: 'on' | 'off'
  editItem: () => void
  removeItem: () => void
}

export default function ThreadBox({ memo, children, isMine, editItem, removeItem }: Props) {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')

  const handleDelete = useCallback(() => {
    deleteMemo(memo.id)
    setOpen(false)
    removeItem()
  }, [memo, removeItem])

  const memu = (
    <Menu
      icon={<MoreHoriz fontSize="small" />}
      label="더 보기"
      items={[
        { active: 'on', label: '글 수정', icon: <EditOutlined />, onClick: editItem },
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
      <DecoBox decos={memo.decos}>
        <ListItem dense secondaryAction={{ on: memu, off: null }[isMine]}>
          <ListItemIcon>{children}</ListItemIcon>
          <ListItemText secondary={convertDate(memo.createdAt)} />
        </ListItem>
        <ListItem dense>{memo.content}</ListItem>
        <ListItem disablePadding divider>
          <ImgGrid images={memo.images} />
        </ListItem>
      </DecoBox>
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
