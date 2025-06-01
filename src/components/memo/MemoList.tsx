'use client'
import { fetchMemos } from '@/shared/fetch/memosApi'
import { Paper, Skeleton, Stack } from '@mui/material'
import { useCallback, useRef, useState } from 'react'
import { GetMemosParams } from '@/shared/types/api'
import { MemoData } from '@/shared/types/client'
import CursorObserver from '@/components/common/CursorObserver'
import MemoBox from '@/components/memo/MemoBox'
import MemoEditForm from '@/components/memo/MemoEditForm'
import { useAppDispatch } from '@/store/hooks'
import { openAlert } from '@/store/slices/alertSlice'

interface Props {
  myId: number
  memos: MemoData[]
  query: GetMemosParams
  actions: {
    addItems: (items: MemoData[], nextCursor: number) => void
    updateItem: (item: MemoData) => void
    removeItem: (itemId: number) => void
    applyDetail: (index: number) => void
  }
}

export default function MemoList(props: Props) {
  const { myId, memos, query, actions } = props
  const { addItems, updateItem, removeItem, applyDetail } = actions
  const [loading, setLoading] = useState('off')
  const [editId, setEdit] = useState(0)
  const beforeQuery = useRef('')
  const dispatch = useAppDispatch()

  const loadMoreMemos = useCallback(() => {
    const cursor = query.cursor
    if (beforeQuery.current === JSON.stringify(query)) return
    beforeQuery.current = JSON.stringify(query)

    if (cursor && cursor < 0) return
    setLoading('on')
    fetchMemos(query)
      .then((result) => {
        addItems(result.memos, result.nextCursor)
      })
      .catch(({ message }) => {
        dispatch(openAlert({ message, severity: 'error' }))
      })
      .finally(() => setLoading('off'))
  }, [addItems, dispatch, query])

  const MemoListItem = (memo: MemoData) => {
    const close = () => setEdit(0)
    const remove = () => removeItem(memo.id)
    const edit = () => setEdit(memo.id)

    const listItem = <MemoBox {...{ myId, memo, remove, edit, updateItem }} />
    const editForm = <MemoEditForm {...{ memo, updateItem, close, alert }} />
    return { [memo.id]: listItem, [editId]: editForm }[memo.id]
  }

  const loadingBox = Array(3)
    .fill(0)
    .map((_, i) => {
      return <Skeleton variant="rounded" height={120} key={'loading' + i} />
    })

  return (
    <Stack spacing={2}>
      {memos.map((memo: MemoData, index) => (
        <Paper key={query.aria + memo.id} sx={{ p: { sm: 1, xs: 0 }, cursor: 'pointer' }} variant="outlined" onClick={() => applyDetail(index)}>
          <MemoListItem {...memo} />
        </Paper>
      ))}
      <CursorObserver loadMoreItems={loadMoreMemos} />
      {{ on: loadingBox, off: null }[loading]}
    </Stack>
  )
}
