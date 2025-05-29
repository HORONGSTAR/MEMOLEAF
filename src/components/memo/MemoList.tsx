'use client'
import { fetchMemos } from '@/shared/fetch/memosApi'
import { Paper, Skeleton, Snackbar, Stack } from '@mui/material'
import { useCallback, useState } from 'react'
import { GetMemosParams } from '@/shared/types/api'
import { MemoData } from '@/shared/types/client'
import CursorObserver from '@/components/common/CursorObserver'
import MemoBox from './MemoBox'
import MemoEditForm from './MemoEditForm'

interface Props {
  myId: number
  memos: MemoData[]
  query: GetMemosParams
  addLoadList: (items: MemoData[], nextCursor: number) => void
  AddEditedItem: (item: MemoData) => void
  removeItem: (itemId: number) => void
  handleSetIndex: (index: number) => void
}

export default function MemoList(props: Props) {
  const { myId, memos, query, addLoadList, AddEditedItem, removeItem, handleSetIndex } = props
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState('off')
  const [editId, setEdit] = useState(0)

  const loadMoreMemos = useCallback(() => {
    const cursor = query.cursor
    if (cursor && cursor < 0) return
    setLoading('on')
    fetchMemos(query)
      .then((result) => {
        addLoadList(result.memos, result.nextCursor)
      })
      .catch(() => setMessage('게시글을 조회 중 문제가 발생했습니다.'))
      .finally(() => setLoading('off'))
  }, [addLoadList, query])

  const MemoListItem = (memo: MemoData) => {
    const item = <MemoBox {...{ myId, memo }} remove={() => removeItem(memo.id)} edit={() => setEdit(memo.id)} />
    const edit = <MemoEditForm memo={memo} add={AddEditedItem} close={() => setEdit(0)} alert={(text: string) => setMessage(text)} />
    return { [memo.id]: item, [editId]: edit }[memo.id]
  }

  const loadingBox = Array(3).map((_, i) => {
    return <Skeleton variant="rounded" height={120} key={'loading' + i} />
  })

  return (
    <Stack spacing={2}>
      {memos.map((memo: MemoData, index) => (
        <Paper key={'memo' + memo.id} sx={{ p: { sm: 1, xs: 0 }, cursor: 'pointer' }} variant="outlined" onClick={() => handleSetIndex(index)}>
          <MemoListItem {...memo} />
        </Paper>
      ))}
      <CursorObserver loadMoreItems={loadMoreMemos} />
      {{ on: loadingBox, off: null }[loading]}
      <Snackbar open={message ? true : false} autoHideDuration={6000} onClose={() => setMessage('')} message={message} />
    </Stack>
  )
}
