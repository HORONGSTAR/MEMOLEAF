'use client'
import { MoreHoriz, DeleteOutline, EditOutlined, LinkOutlined } from '@mui/icons-material'
import { ImgGrid, MemoForm, Menu, MenuItem, Avatar, Card, MemoStyle } from '@/components'
import { updateMemoThunk, deleteMemoThunk } from '@/store/slices/postSlice'
import { useCallback, useMemo, useState } from 'react'
import { changeDate } from '@/lib/utills'
import { useAppDispatch } from '@/store/hooks'
import { Memo, Image, Params } from '@/lib/types'
import { useSession } from 'next-auth/react'

export default function MemoCard(memo: Memo) {
  const dispatch = useAppDispatch()
  const [isEdit, setEdit] = useState(false)
  const { data: session } = useSession()
  const user = session?.user

  const isLogin = useMemo(() => (user?.id === memo.userId ? true : false), [user, memo])

  const onSubmit = useCallback(
    (params: Params) => {
      dispatch(updateMemoThunk({ ...params, id: memo?.id }))
      setEdit(false)
    },
    [dispatch, memo]
  )

  const handleDelete = useCallback(
    (id: number, imageList: Image[]) => {
      const images = imageList.map((img) => img.url)
      dispatch(deleteMemoThunk({ id, images }))
    },
    [dispatch]
  )

  const meunItems = [
    {
      isBlind: !isLogin,
      label: '글 수정',
      icon: <EditOutlined fontSize="small" />,
      onClick: () => setEdit(true),
    },
    {
      isBlind: !isLogin,
      label: '삭제',
      icon: <DeleteOutline fontSize="small" />,
      onClick: () => handleDelete(memo.id, memo.images),
    },
    {
      label: '공유하기',
      icon: <LinkOutlined fontSize="small" />,
      onClick: () => handleDelete(memo.id, memo.images),
    },
  ]

  const menu = (
    <Menu icon={<MoreHoriz fontSize="small" />} label="post-menu">
      {meunItems.map((item) => (
        <MenuItem key={item.label} {...item} />
      ))}
    </Menu>
  )

  const header = {
    avatar: <Avatar user={memo.user} />,
    action: menu,
    title: memo.user.name,
    subheader: changeDate(memo.createdAt),
  }

  if (isEdit) {
    const props = { ...memo, onSubmit }
    return <MemoForm {...props} />
  }

  return (
    <Card header={header} items={['header']}>
      <MemoStyle>
        {memo.content}
        <ImgGrid images={memo.images} />
      </MemoStyle>
    </Card>
  )
}
