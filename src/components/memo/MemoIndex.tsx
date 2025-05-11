'use client'
import { getMemosThunk, createMemoThunk } from '@/store/slices/memoSlice'
import { AsyncBox, MemoForm, MemoBox, ImgGrid, MemoDeco, LinkBox } from '@/components'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { useCallback, useEffect } from 'react'
import { Memo, MemoParams } from '@/lib/types'
import { useSession } from 'next-auth/react'
import { editImageUrl } from '@/lib/utills'

export default function MemoIndex() {
  const { memos, status } = useAppSelector((state) => state.memo)
  const dispatch = useAppDispatch()
  const { data: session } = useSession()
  const user = session?.user

  useEffect(() => {
    dispatch(getMemosThunk(1))
  }, [dispatch])

  const onSubmit = useCallback(
    (params: MemoParams) => {
      if (user) dispatch(createMemoThunk({ ...params, id: user.id }))
    },
    [dispatch, user]
  )

  const components = (
    <>
      <MemoForm onSubmit={onSubmit} />
      {memos?.map((memo: Memo) => (
        <MemoBox key={memo.id} {...memo}>
          <LinkBox link={`/page/memo/${memo.id}`}>
            <MemoDeco decos={memo.decos}>
              {memo.content}
              <ImgGrid images={editImageUrl(memo.images)} />
            </MemoDeco>
          </LinkBox>
        </MemoBox>
      ))}
    </>
  )

  return <AsyncBox state={status} component={components} />
}
