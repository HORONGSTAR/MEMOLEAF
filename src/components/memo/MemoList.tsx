'use client'
import { getMemosThunk, createMemoThunk } from '@/store/slices/memoSlice'
import { AsyncBox, MemoForm, MemoBox, ImgGrid, Card, MemoFooter, MemoHeader, ExpandButton, MemoThread, LoginBox } from '@/components'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { useCallback, useEffect } from 'react'
import { Memo, MemoParams } from '@/lib/types'
import { useSession } from 'next-auth/react'
import { editImageUrl } from '@/lib/utills'
import { AutoStoriesOutlined } from '@mui/icons-material'
import Link from 'next/link'
import { Box, CardContent, Typography } from '@mui/material'

export default function MemoList() {
  const { memos, status } = useAppSelector((state) => state.memo)
  const dispatch = useAppDispatch()
  const { data: session } = useSession()
  const user = session?.user

  useEffect(() => {
    dispatch(getMemosThunk({ page: 1, limit: 10 }))
  }, [user, dispatch])

  const handleCreateMemo = useCallback(
    (params: Omit<MemoParams, 'id'>) => {
      if (!user) return
      dispatch(createMemoThunk({ ...params, id: user.id }))
    },
    [dispatch, user]
  )

  const components = memos?.map((memo: Memo) => (
    <Card key={memo.id}>
      <MemoBox
        {...memo}
        header={<MemoHeader {...memo} />}
        footer={
          <MemoFooter id={memo.id} _count={memo._count}>
            <ExpandButton LinkComponent={Link} href={`/page/memo/${memo.id}`}>
              <AutoStoriesOutlined fontSize="small" />
              <span className="label">페이지</span>
            </ExpandButton>
          </MemoFooter>
        }
      >
        <CardContent>{memo.content}</CardContent>
        <ImgGrid images={editImageUrl(memo.images)} />
      </MemoBox>
      <MemoThread count={memo._count.leafs} id={memo.id} />
    </Card>
  ))

  return (
    <AsyncBox state={status}>
      {user ? (
        <Card use="create">
          <MemoForm onSubmit={handleCreateMemo} />
        </Card>
      ) : (
        <Box sx={{ px: 10 }}>
          <Typography color="primary" align="center" variant="h6">
            로그인 후 기록을 남겨보세요!
          </Typography>
          <Typography color="primary" variant="body2" align="center" sx={{ mb: 2 }}>
            소셜로그인으로 간편하게 사용할 수 있어요.
          </Typography>
          <LoginBox />
        </Box>
      )}

      {components}
    </AsyncBox>
  )
}
