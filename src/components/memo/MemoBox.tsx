'use client'
import { Dispatch, ReactNode, SetStateAction, useCallback, useMemo, useState } from 'react'
import { MoreHoriz, DeleteOutline, EditOutlined, LinkOutlined } from '@mui/icons-material'
import { updateMemoThunk, deleteMemoThunk } from '@/store/slices/memoSlice'
import { Card, CardContent, CardHeader, CardHeaderProps, Snackbar } from '@mui/material'
import { Memo, MemoParams, EditDeco } from '@/lib/types'
import { useAppDispatch } from '@/store/hooks'
import { Avatar, LinkBox, MemoForm, Menu } from '@/components'
import { changeDate, copyText } from '@/lib/utills'
import { useSession } from 'next-auth/react'

interface Props extends Memo {
  activeUserInfo?: string
  children: ReactNode
  setMemo?: Dispatch<SetStateAction<Memo>>
}

type UserInfo = {
  [key: string]: CardHeaderProps
}

export default function MemoContent(inti: Props) {
  const dispatch = useAppDispatch()
  const [isEdit, setEdit] = useState(false)
  const [message, setMessage] = useState('')
  const { data: session } = useSession()
  const { children, user, id, images, activeUserInfo, setMemo } = inti
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

  const userInfo: UserInfo = {
    on: {
      avatar: (
        <LinkBox link={`/page/my/${inti.user.id}`}>
          <Avatar user={inti.user} />
        </LinkBox>
      ),
      title: <LinkBox link={`/page/my/${inti.user.id}`}>{inti.user.name}</LinkBox>,
      subheader: changeDate(inti.createdAt),
    },
    off: { subheader: <small>{changeDate(inti.createdAt)}</small> },
  }

  if (isEdit) {
    const decos: EditDeco = {}
    inti.decos.forEach((deco) => (decos[deco.kind] = { active: 'on', extra: deco.extra }))
    const props = { ...inti, onSubmit, decos }
    return <MemoForm {...props} />
  }

  return (
    <Card variant="outlined">
      <CardHeader
        {...userInfo[activeUserInfo || 'on']}
        action={<Menu icon={<MoreHoriz fontSize="small" />} label="메모 메뉴 열기" items={meunItems} />}
      />
      <CardContent>{children}</CardContent>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={message ? true : false}
        autoHideDuration={6000}
        onClose={() => setMessage('')}
        message={message}
      />
    </Card>
  )
}
