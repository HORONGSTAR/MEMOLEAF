'use client'
import { getMemosThunk, createMemoThunk } from '@/store/slices/memoSlice'
import { AsyncBox, MemoForm, MemoBox, ImgGrid, LinkBox } from '@/components'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { useCallback, useEffect } from 'react'
import { Memo, MemoParams } from '@/lib/types'
import { useSession } from 'next-auth/react'
import { editImageUrl } from '@/lib/utills'
import { Card } from '@mui/material'

export default function MemoIndex() {
  const { memos, status } = useAppSelector((state) => state.memo)
  const dispatch = useAppDispatch()
  const { data: session } = useSession()
  const user = session?.user

  useEffect(() => {
    dispatch(getMemosThunk({ page: 1 }))
  }, [dispatch])

  const handleCreateMemo = useCallback(
    (params: MemoParams) => {
      if (!user) return
      dispatch(createMemoThunk({ ...params, id: user.id }))
    },
    [dispatch, user]
  )

  const components = memos?.map((memo: Memo) => (
    <Card key={memo.id} variant="outlined">
      <LinkBox link={`/page/memo/${memo.id}`}>
        <MemoBox {...memo}>
          {memo.content}
          <ImgGrid images={editImageUrl(memo.images)} />
        </MemoBox>
      </LinkBox>
    </Card>
  ))

  return (
    <AsyncBox state={status}>
      <MemoForm onSubmit={handleCreateMemo} />
      {components}
    </AsyncBox>
  )
}
