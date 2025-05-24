'use client'
import { ReactNode, useCallback, useState } from 'react'
import { ImgGrid } from '@/components/img'
import { Menu, Dialog } from '@/components/common'
import { MoreHoriz, DeleteOutline, EditOutlined } from '@mui/icons-material'
import { Snackbar, Typography, Button, ListItem, ListItemText, Box, ListItemIcon } from '@mui/material'
import { MemoData, MemoParams, EditDeco, OnOffItem, UserData } from '@/lib/types'
import { addImagePath, checkCurrentOnOff, changeDate } from '@/lib/utills'
import { useSession } from 'next-auth/react'
import { deleteMemo, updateMemo } from '@/lib/fetch/memoApi'
import { MemoForm } from '.'
import DecoBox from './DecoBox'
import { grey } from '@mui/material/colors'

interface Props {
  memo: MemoData
  user?: UserData
  children: ReactNode
}

export default function MemoBox(props: Props) {
  const { children } = props
  const [memo, setMemo] = useState(props.memo)
  const [action, setAction] = useState('view')
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const { data: session } = useSession()
  const myId = session?.user.id
  const isMine = checkCurrentOnOff(memo.userId, myId || 0)

  const onSubmit = useCallback(
    (params: Omit<MemoParams, 'id'>) => {
      updateMemo({ ...params, id: memo.id })
        .then((result) => setMemo((prev) => ({ ...prev, ...result })))
        .catch()
      setAction('view')
    },
    [memo]
  )

  const handleDelete = useCallback(() => {
    deleteMemo(memo.id)
    setAction('remove')
    setOpen(false)
  }, [memo])

  const decos: EditDeco = {}
  memo.decos.forEach((deco) => (decos[deco.kind] = { active: 'on', extra: deco.extra }))
  const editProps = { ...memo, onSubmit, decos, placeholder: '메모 내용 수정하기' }

  const dialogProps = {
    open,
    title: '메모를 삭제할까요?',
    closeLabel: '취소',
    actionLabel: '삭제',
    onClose: () => setOpen(false),
    onAction: handleDelete,
  }

  const memu = (
    <Menu
      icon={<MoreHoriz fontSize="small" />}
      label="더 보기"
      items={[
        { active: isMine, label: '글 수정', icon: <EditOutlined />, onClick: () => setAction('edit') },
        { active: isMine, label: '삭제', icon: <DeleteOutline />, onClick: () => setOpen(true) },
      ]}
    />
  )

  const memoStateBox: OnOffItem = {
    view: (
      <Box>
        <DecoBox decos={memo.decos}>
          <ListItem dense secondaryAction={memu}>
            <ListItemIcon>{children}</ListItemIcon>
            <ListItemText secondary={changeDate(memo.createdAt)} />
          </ListItem>
          <ListItem dense>{memo.content}</ListItem>
          <ListItem disablePadding divider>
            <ImgGrid layout="list" images={addImagePath(memo.images)} />
          </ListItem>
        </DecoBox>
      </Box>
    ),
    edit: (
      <Box sx={{ bgcolor: grey[100], p: 1 }}>
        <MemoForm {...editProps}>
          <Button color="error" onClick={() => setAction('view')}>
            취소
          </Button>
        </MemoForm>
      </Box>
    ),
    remove: (
      <Box sx={{ bgcolor: grey[100], p: 1 }}>
        <Typography color="textDisabled">삭제된 메모입니다.</Typography>
      </Box>
    ),
  }

  return (
    <>
      {memoStateBox[action]}
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
