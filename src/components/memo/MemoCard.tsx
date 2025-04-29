'use client'
import { getMemosThunk, updateMemoThunk, deleteMemoThunk } from '@/store/slices/postSlice'
import { ImgGrid, MemoForm, Menu, Avatar, AsyncBox, Card } from '@/components'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { changeDate, imgPath } from '@/lib/utills'
import { Memo, Image } from '@/lib/types'
import { useSession } from 'next-auth/react'
import { MenuItem, ListItemIcon } from '@mui/material'
import { MoreHoriz, DeleteOutline, EditOutlined, LinkOutlined } from '@mui/icons-material'

export default function MemoCard() {
  const { memos, status } = useAppSelector((state) => state.memo)
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(getMemosThunk({ page: '1' }))
  }, [dispatch])

  const cards = memos?.map((memo: Memo) => <CardBox key={memo.id} {...memo} />)

  return <AsyncBox state={status} component={cards} />
}

const CardBox = (memo: Memo) => {
  const dispatch = useAppDispatch()
  const [content, setContent] = useState(memo.content)
  const [isEdit, setEdit] = useState(false)
  const { data: session } = useSession()
  const user = session?.user
  const isLogin = useMemo(() => (user?.id === memo.userId ? true : false), [user, memo])

  const onSubmit = useCallback(
    (id: number, content: string) => {
      dispatch(updateMemoThunk({ id, content }))
      setContent(content)
      setEdit(false)
    },
    [dispatch]
  )

  const handleDelete = useCallback(
    (id: number, imageList: Image[]) => {
      const images = imageList.map((img) => img.url)
      dispatch(deleteMemoThunk({ id, images }))
    },
    [dispatch]
  )

  if (isEdit) {
    const props = { ...memo, onSubmit, images: memo.images.map((img) => imgPath + img.url) }
    return <MemoForm {...props} />
  }

  const header = {
    avatar: <Avatar user={memo.user} />,
    action: (
      <Menu icon={<MoreHoriz fontSize="small" />} label="post-menu">
        {isLogin && (
          <MenuItem onClick={() => setEdit(true)}>
            <ListItemIcon>
              <EditOutlined fontSize="small" />
            </ListItemIcon>
            글 수정
          </MenuItem>
        )}
        {isLogin && (
          <MenuItem onClick={() => handleDelete(memo.id, memo.images)}>
            <ListItemIcon>
              <DeleteOutline fontSize="small" />
            </ListItemIcon>
            삭제
          </MenuItem>
        )}
        <MenuItem>
          <ListItemIcon>
            <LinkOutlined fontSize="small" />
          </ListItemIcon>
          공유하기
        </MenuItem>
      </Menu>
    ),
    title: memo.user.name,
    subheader: changeDate(memo.createdAt),
  }

  return (
    <Card header={header} items={['header']}>
      {content}
      <ImgGrid images={memo.images} />
    </Card>
  )
}
