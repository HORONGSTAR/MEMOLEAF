'use client'
import { getMemosThunk, createMemoThunk } from '@/store/slices/postSlice'
import { AsyncBox, MemoCard, MemoForm } from '@/components'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { useCallback, useEffect } from 'react'
import { Memo, Params } from '@/lib/types'

export default function MemoIndex() {
  const { memos, status } = useAppSelector((state) => state.memo)
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(getMemosThunk({ page: '1' }))
  }, [dispatch])

  const onSubmit = useCallback(
    (props: Params) => {
      dispatch(createMemoThunk(props))
    },
    [dispatch]
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
