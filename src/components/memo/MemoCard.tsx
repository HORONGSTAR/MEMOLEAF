'use client'
import { ReactNode, useCallback, useMemo, useState } from 'react'
import { MemoForm, Menu, Paper, Dialog, MemoDeco, LinkBox, Avatar, MemoLink, ImgGrid, CommentButton } from '@/components'
import { MoreHoriz, DeleteOutline, EditOutlined, LinkOutlined } from '@mui/icons-material'
import { Snackbar, Typography, Button } from '@mui/material'
import { CardContent, CardHeader, CardActions } from '@mui/material'
import { Memo, MemoParams, EditDeco, ActiveNode } from '@/lib/types'
import { addImagePath, changeDate, copyText } from '@/lib/utills'
import { useSession } from 'next-auth/react'
import { deleteMemo, updateMemo } from '@/lib/api/memoApi'

interface Props {
  memo: Memo
  isDetail?: boolean
  children?: ReactNode
}

export default function MemoCard(props: Props) {
  const { isDetail } = props
  const [memo, setMemo] = useState(props.memo)
  const [action, setAction] = useState('view')
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const { data: session } = useSession()
  const auth = session?.user

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

  const active = useMemo(() => (auth?.id === memo.userId ? 'on' : 'off'), [auth, memo])

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

  const components: ActiveNode = {
    view: (
      <Paper kind="card" sx={{ border: isDetail ? 'none' : null }}>
        <CardHeader
          avatar={
            <LinkBox link={`/my/${memo.user.id}`}>
              <Avatar user={memo.user} size={36} />
            </LinkBox>
          }
          title={<LinkBox link={`/my/${memo.user.id}`}>{memo.user.name}</LinkBox>}
          subheader={changeDate(memo.createdAt)}
          action={
            <Menu
              icon={<MoreHoriz fontSize="small" />}
              label="메모 메뉴 열기"
              items={[
                { active, label: '글 수정', icon: <EditOutlined />, onClick: () => setAction('edit') },
                { active, label: '삭제', icon: <DeleteOutline />, onClick: () => setOpen(true) },
                { active: 'on', label: '공유하기', icon: <LinkOutlined />, onClick: () => handleCopy() },
              ]}
            />
          }
        />
        <MemoDeco decos={memo.decos}>
          <CardContent>
            {memo.content}
            <ImgGrid images={addImagePath(memo.images)} isDetail={isDetail} />
          </CardContent>
        </MemoDeco>
        <CardActions>
          <CommentButton id={memo.id} count={memo._count.comments} user={memo.user} />
          {isDetail || <MemoLink id={memo.id} />}
        </CardActions>
      </Paper>
    ),
    edit: (
      <Paper use="edit" kind="card">
        <MemoForm {...editProps}>
          <Button color="error" onClick={() => setAction('view')}>
            취소
          </Button>
        </MemoForm>
      </Paper>
    ),
    remove: (
      <Paper sx={{ bgcolor: '#eee', p: 2 }} kind="card">
        <Typography color="textDisabled">삭제된 메모입니다.</Typography>
      </Paper>
    ),
  }

  return (
    <>
      {components[action]}
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
