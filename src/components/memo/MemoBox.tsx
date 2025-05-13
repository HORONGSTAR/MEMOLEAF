'use client'
import { Dispatch, ReactNode, SetStateAction, useCallback, useMemo, useState } from 'react'
import { MemoForm, Menu, MemoBoxHeader, MemoDeco, MemoBoxFooter, Card, Dialog } from '@/components'
import { MoreHoriz, DeleteOutline, EditOutlined, LinkOutlined } from '@mui/icons-material'
import { updateMemoThunk, deleteMemoThunk } from '@/store/slices/memoSlice'
import { Snackbar, CardContent, Typography, Box, Button } from '@mui/material'
import { Memo, MemoParams, EditDeco } from '@/lib/types'
import { useAppDispatch } from '@/store/hooks'
import { copyText } from '@/lib/utills'
import { useSession } from 'next-auth/react'

interface Props extends Memo {
  headerStyle?: 'card' | 'list'
  footerStyle?: 'detail' | 'index'
  children: ReactNode
  setMemo?: Dispatch<SetStateAction<Memo>>
}

type Components = { [key: string]: ReactNode }

export default function MemoBox(inti: Props) {
  const dispatch = useAppDispatch()
  const [use, setUse] = useState('view')
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const { data: session } = useSession()
  const { children, user, id, images, headerStyle, footerStyle, setMemo } = inti
  const auth = session?.user

  const onSubmit = useCallback(
    (params: Omit<MemoParams, 'id'>) => {
      dispatch(updateMemoThunk({ ...params, id: inti.id }))
        .unwrap()
        .then((result) => setMemo && setMemo({ ...inti, ...result }))
    },
    [dispatch, setMemo, inti]
  )

  const handleDelete = useCallback(
    (params: Pick<Memo, 'id' | 'images'>) => {
      const images = { file: [], add: [], del: params.images }
      dispatch(deleteMemoThunk({ ...params, images }))
      setUse('remove')
    },
    [dispatch]
  )

  const handleCopy = useCallback(async () => {
    const url = `${window.location.origin}/page/memo/${id}`
    const reuslt = copyText(url, '링크를')
    setMessage(await reuslt)
  }, [id])

  const active = useMemo(() => (auth?.id === user.id ? 'on' : 'off'), [auth, user])
  const memoMemu = (
    <Menu
      icon={<MoreHoriz fontSize="small" />}
      label="메모 메뉴 열기"
      items={[
        { active, label: '글 수정', icon: <EditOutlined />, onClick: () => setUse('edit') },
        { active, label: '삭제', icon: <DeleteOutline />, onClick: () => setOpen(true) },
        { active: 'on', label: '공유하기', icon: <LinkOutlined />, onClick: () => handleCopy() },
      ]}
    />
  )

  const removeAction = (
    <>
      <Button onClick={() => setOpen(false)}>취소</Button>
      <Button color="error" onClick={() => handleDelete({ id, images })}>
        삭제
      </Button>
    </>
  )

  const editProps = useMemo(() => {
    const decos: EditDeco = {}
    inti.decos.forEach((deco) => (decos[deco.kind] = { active: 'on', extra: deco.extra }))
    return { ...inti, onSubmit, decos, placeholder: '메모 내용 수정하기' }
  }, [inti, onSubmit])

  const components: Components = {
    view: (
      <>
        <MemoBoxHeader {...inti} action={memoMemu} variant={headerStyle} />
        <CardContent>
          <MemoDeco decos={inti.decos}>{children}</MemoDeco>
        </CardContent>
        <MemoBoxFooter count={inti._count} id={id} style={footerStyle || 'index'} />
        <Dialog open={open} actions={removeAction}>
          <Typography>메모를 삭제할까요?</Typography>
          <Typography>삭제한 메모는 복구할 수 없습니다.</Typography>
        </Dialog>
      </>
    ),
    edit: (
      <Card use="edit">
        <MemoForm {...editProps}>
          <Button color="error" onClick={() => setUse('view')}>
            취소
          </Button>
        </MemoForm>
      </Card>
    ),
    remove: (
      <Box sx={{ bgcolor: '#eee', p: 2 }}>
        <Typography color="textDisabled">삭제된 메모입니다.</Typography>
      </Box>
    ),
  }

  return (
    <>
      {components[use]}
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={message ? true : false}
        autoHideDuration={6000}
        onClose={() => setMessage('')}
        message={message}
      />
    </>
  )
}
