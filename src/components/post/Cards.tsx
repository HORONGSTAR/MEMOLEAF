'use client'
import { getMemoThunk, updateMemoThunk, deleteMemoThunk } from '@/store/slices/postSlice'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { Card, CardContent, CardHeader, MenuItem } from '@mui/material'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { MenuBox, ReturnBox, UserAvatar } from '@/styles/BaseStyles'
import { useSession } from 'next-auth/react'
import { MoreHoriz } from '@mui/icons-material'
import { Memo } from '@/lib/types'
import { changeDate } from '@/lib/utills'
import { PostForm } from '@/components/post/Forms'

export const PostCards = () => {
  const { memos, status } = useAppSelector((state) => state.memo)
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(getMemoThunk({ page: '1', limit: '10' }))
  }, [dispatch])

  const cards = memos?.map((memo: Memo) => <PostCard key={memo.id} {...memo} />)

  return <ReturnBox state={status} component={cards} />
}

export const PostCard = (memo: Memo) => {
  const dispatch = useAppDispatch()
  const [content, setContent] = useState(memo.content)
  const [isEdit, setEdit] = useState(false)
  const { data: session } = useSession()
  const user = session?.user
  const isLogin = useMemo(() => (user?.id === memo.userId ? true : false), [user, memo])

  const onSubmit = useCallback(
    (memoId: number, content: string) => {
      dispatch(updateMemoThunk({ memoId, content }))
      setContent(content)
      setEdit(false)
    },
    [dispatch]
  )

  const handleDelete = useCallback(
    (memoId: number) => {
      dispatch(deleteMemoThunk({ memoId }))
    },
    [dispatch]
  )

  if (isEdit) return <PostForm {...memo} content={content} onSubmit={onSubmit} />
  return (
    <Card variant="outlined">
      <CardHeader
        avatar={<UserAvatar user={memo.user} />}
        action={
          <MenuBox icon={<MoreHoriz fontSize="small" />} label="post-menu">
            {isLogin && <MenuItem onClick={() => setEdit(true)}>수정</MenuItem>}
            {isLogin && <MenuItem onClick={() => handleDelete(memo.id)}>삭제</MenuItem>}
            <MenuItem>공유</MenuItem>
          </MenuBox>
        }
        title={memo.user.name}
        subheader={changeDate(memo.createdAt)}
      />
      <CardContent>{content}</CardContent>
    </Card>
  )
}
