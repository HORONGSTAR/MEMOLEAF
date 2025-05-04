'use client'
import { getMemosThunk, createMemoThunk } from '@/store/slices/postSlice'
import { AsyncBox, MemoCard, MemoForm } from '@/components'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { useCallback, useEffect } from 'react'
import { MemoProps, MemoParamsCU } from '@/lib/types'

export default function MemoIndex() {
  const { memos, status } = useAppSelector((state) => state.memo)
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(getMemosThunk(1))
  }, [dispatch])

  const onSubmit = useCallback(
    (props: MemoParamsCU) => {
      dispatch(createMemoThunk(props))
    },
    [dispatch]
  )

  const intiMemoProps = { id: 0, content: '', images: [], styles: [], onSubmit }

  const components = (
    <>
      <MemoForm {...intiMemoProps} />
      {memos?.map((memo: MemoProps) => (
        <MemoCard key={memo.id} {...memo} />
      ))}
    </>
  )

  return <AsyncBox state={status} component={components} />
}
