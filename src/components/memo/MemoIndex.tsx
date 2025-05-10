'use client'
import { getMemosThunk, createMemoThunk } from '@/store/slices/memoSlice'
import { AsyncBox, MemoCard, MemoForm } from '@/components'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { useCallback, useEffect } from 'react'
import { Memo, MemoParams } from '@/lib/types'
import { useSession } from 'next-auth/react'

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
        <MemoCard key={memo.id} {...memo} />
      ))}
    </>
  )

  return <AsyncBox state={status} component={components} />
}
