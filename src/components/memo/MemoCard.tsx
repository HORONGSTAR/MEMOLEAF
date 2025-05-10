'use client'
import { Card, CardContent, CardHeader } from '@mui/material'
import { MoreHoriz, DeleteOutline, EditOutlined, LinkOutlined } from '@mui/icons-material'
import { ImgGrid, MemoForm, Menu, Avatar, MemoDeco, LinkBox } from '@/components'
import { updateMemoThunk, deleteMemoThunk } from '@/store/slices/memoSlice'
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

  if (isEdit) {
    const decos: EditDeco = {}
    memo.decos.forEach((deco) => (decos[deco.kind] = { active: 'on', extra: deco.extra }))
    const props = { ...memo, onSubmit, decos }
    return <MemoForm {...props} />
  }
  const imageData = memo.images.map((img) => ({ ...img, url: imgPath + img.url }))
  return (
    <Card variant="outlined">
      <CardHeader
        action={<Menu icon={<MoreHoriz fontSize="small" />} label="메모 메뉴 열기" items={meunItems} />}
        avatar={
          <LinkBox link={`/page/my/${memo.user.id}`}>
            <Avatar user={memo.user} />
          </LinkBox>
        }
        title={<LinkBox link={`/page/my/${memo.user.id}`}>{memo.user.name}</LinkBox>}
        subheader={changeDate(memo.createdAt)}
      />
      <LinkBox link={`/page/memo/${memo.id}`}>
        <CardContent>
          <MemoDeco decos={decos}>
            {memo.content}
            <ImgGrid images={imageData} />
          </MemoDeco>
        </CardContent>
      </LinkBox>
    </Card>
  )
}
