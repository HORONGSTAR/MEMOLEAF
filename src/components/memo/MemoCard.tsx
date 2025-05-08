'use client'
import { MoreHoriz, DeleteOutline, EditOutlined, LinkOutlined } from '@mui/icons-material'
import { ImgGrid, MemoForm, Menu, Avatar, Card, MemoStyle } from '@/components'
import { updateMemoThunk, deleteMemoThunk } from '@/store/slices/postSlice'
import { useCallback, useMemo, useState } from 'react'
import { changeDate, imgPath } from '@/lib/utills'
import { useAppDispatch } from '@/store/hooks'
import { MemoProps, MemoParamsCU, Image } from '@/lib/types'
import { useSession } from 'next-auth/react'

export default function MemoCard(memo: MemoProps) {
  const dispatch = useAppDispatch()
  const [isEdit, setEdit] = useState(false)
  const { data: session } = useSession()
  const user = session?.user

  const isLogin = useMemo(() => (user?.id === memo.userId ? true : false), [user, memo])

  const onSubmit = useCallback(
    (params: MemoParamsCU) => {
      dispatch(updateMemoThunk({ ...params, id: memo.id }))
      setEdit(false)
    },
    [dispatch, memo]
  )

  const handleDelete = useCallback(
    (id: number, images: Image[]) => {
      dispatch(deleteMemoThunk({ id, images: { files: [], create: [], remove: images } }))
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

  const menu = <Menu icon={<MoreHoriz fontSize="small" />} label="메모 메뉴 열기" items={meunItems} />

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

  const imgUrls = memo.images.map((img) => ({ id: img.id, url: imgPath + img.url }))

  return (
    <Card header={header}>
      <MemoStyle styles={memo.styles}>
        {memo.content}
        <ImgGrid images={imgUrls} />
      </MemoStyle>
    </Card>
  )
}
