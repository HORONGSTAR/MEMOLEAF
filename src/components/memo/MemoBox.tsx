'use client'
import { Dispatch, ReactNode, SetStateAction, useCallback, useMemo, useState } from 'react'
import { MoreHoriz, DeleteOutline, EditOutlined, LinkOutlined } from '@mui/icons-material'
import { updateMemoThunk, deleteMemoThunk } from '@/store/slices/memoSlice'
import { Snackbar, CardContent } from '@mui/material'
import { Memo, MemoParams, EditDeco } from '@/lib/types'
import { useAppDispatch } from '@/store/hooks'
import { MemoForm, Menu, MemoBoxHeader, MemoDeco } from '@/components'
import { copyText } from '@/lib/utills'
import { useSession } from 'next-auth/react'

interface Props extends Memo {
  headerStyle?: 'card' | 'list'
  children: ReactNode
  setMemo?: Dispatch<SetStateAction<Memo>>
}

export default function MemoBox(inti: Props) {
  const dispatch = useAppDispatch()
  const [isEdit, setEdit] = useState(false)
  const [message, setMessage] = useState('')
  const { data: session } = useSession()
  const { children, user, id, images, headerStyle, setMemo } = inti
  const auth = session?.user

  const onSubmit = useCallback(
    (params: MemoParams) => {
      dispatch(updateMemoThunk({ ...params, id: inti.id }))
        .unwrap()
        .then((result) => setMemo && setMemo({ ...inti, ...result }))
      setEdit(false)
    },
    [dispatch, setMemo, inti]
  )

  const handleDelete = useCallback(
    (params: Pick<Memo, 'id' | 'images'>) => {
      const images = { file: [], add: [], del: params.images }
      dispatch(deleteMemoThunk({ ...params, images }))
    },
    [dispatch]
  )

  const handleCopy = useCallback(async () => {
    const url = `${window.location.origin}/page/memo/${id}`
    const reuslt = copyText(url, '링크를')
    setMessage(await reuslt)
  }, [id])

  const active = useMemo(() => {
    return auth?.id === user.id ? 'on' : 'off'
  }, [auth, user])

  const meunItems = [
    {
      active,
      label: '글 수정',
      icon: <EditOutlined fontSize="small" />,
      onClick: () => setEdit(true),
    },
    {
      active,
      label: '삭제',
      icon: <DeleteOutline fontSize="small" />,
      onClick: () => handleDelete({ id, images }),
    },
    {
      active,
      label: '공유하기',
      icon: <LinkOutlined fontSize="small" />,
      onClick: () => handleCopy(),
    },
  ]

  const menu = <Menu icon={<MoreHoriz fontSize="small" />} label="메모 메뉴 열기" items={meunItems} />

  if (isEdit) {
    const decos: EditDeco = {}
    inti.decos.forEach((deco) => (decos[deco.kind] = { active: 'on', extra: deco.extra }))
    const props = { ...inti, onSubmit, decos }
    return <MemoForm {...props} placeholder="메모 내용 수정하기" />
  }

  return (
    <>
      <MemoBoxHeader {...inti} action={menu} headerStyle={headerStyle} />
      <CardContent>
        <MemoDeco decos={inti.decos}>{children}</MemoDeco>
      </CardContent>
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
