'use client'
import { MoreHoriz, DeleteOutline, EditOutlined, LinkOutlined } from '@mui/icons-material'
import { ImgGrid, MemoForm, Menu, Avatar, Card, MemoDeco } from '@/components'
import { updateMemoThunk, deleteMemoThunk } from '@/store/slices/postSlice'
import { useCallback, useMemo, useState } from 'react'
import { changeDate, imgPath } from '@/lib/utills'
import { useAppDispatch } from '@/store/hooks'
import { Memo, MemoParams, EditDeco } from '@/lib/types'
import { useSession } from 'next-auth/react'

export default function MemoCard(memo: Memo) {
  const dispatch = useAppDispatch()
  const [isEdit, setEdit] = useState(false)
  const { data: session } = useSession()
  const auth = session?.user
  const { id, user, images, decos } = memo

  const onSubmit = useCallback(
    (params: MemoParams) => {
      dispatch(updateMemoThunk({ ...params, id: memo.id }))
      setEdit(false)
    },
    [dispatch, memo]
  )

  const handleDelete = useCallback(
    (props: Pick<Memo, 'id' | 'images'>) => {
      const images = { file: [], add: [], del: props.images }
      dispatch(deleteMemoThunk({ ...props, images }))
    },
    [dispatch]
  )

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
      onClick: () => setEdit(true),
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
    const decos: EditDeco = {}
    memo.decos.forEach((deco) => (decos[deco.kind] = { active: 'on', extra: deco.extra }))
    const props = { ...memo, onSubmit, decos }
    return <MemoForm {...props} />
  }
  const imageData = memo.images.map((img) => ({ ...img, url: imgPath + img.url }))

  return (
    <Card header={header}>
      <MemoDeco decos={decos}>
        {memo.content}
        <ImgGrid images={imageData} />
      </MemoDeco>
    </Card>
  )
}
