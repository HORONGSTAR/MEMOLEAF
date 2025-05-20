'use client'
import { useCallback, useState } from 'react'
import { Menu, Paper, Dialog, ImgGrid } from '@/components'
import { MemoForm, MemoContent } from '@/components'
import { MoreHoriz, DeleteOutline, EditOutlined, LinkOutlined } from '@mui/icons-material'
import { Snackbar, Typography, Button } from '@mui/material'
import { MemoData, Layout, MemoParams, EditDeco, OnOffItem } from '@/lib/types'
import { addImagePath, copyText, checkCurrentOnOff } from '@/lib/utills'
import { useSession } from 'next-auth/react'
import { deleteMemo, updateMemo } from '@/lib/fetch/memoApi'

interface Props {
  memo: MemoData
  layout: Layout
}

export default function MemoBox(props: Props) {
  const { layout } = props
  const [memo, setMemo] = useState(props.memo)
  const [action, setAction] = useState('view')
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const { data: session } = useSession()
  const myId = session?.user.id
  const isMine = checkCurrentOnOff(memo.user.id, myId || 0)

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

  const handleCopy = useCallback(async () => {
    const url = `${window.location.origin}/memo/${memo.id}`
    const reuslt = copyText(url, '링크를')
    setMessage(await reuslt)
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
        { active: 'on', label: '공유하기', icon: <LinkOutlined />, onClick: () => handleCopy() },
      ]}
    />
  )

  const memoStateBox: OnOffItem = {
    view: (
      <MemoContent memo={memo} memu={memu} layout={layout}>
        <ImgGrid layout={layout} images={addImagePath(memo.images)} />
      </MemoContent>
    ),
    edit: (
      <Paper use="edit">
        <MemoForm {...editProps}>
          <Button color="error" onClick={() => setAction('view')}>
            취소
          </Button>
        </MemoForm>
      </Paper>
    ),
    remove: (
      <Paper sx={{ bgcolor: '#eee', p: 2 }}>
        <Typography color="textDisabled">삭제된 메모입니다.</Typography>
      </Paper>
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
