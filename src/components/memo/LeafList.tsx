'use client'
import { fetchMemos } from '@/shared/fetch/memosApi'
import { Skeleton, Snackbar, Stack } from '@mui/material'
import { Dispatch, SetStateAction, useCallback, useRef, useState } from 'react'
import { MemoData } from '@/shared/types/client'
import CursorObserver from '@/components/common/CursorObserver'
import LeafBox from './LeafBox'
import MemoEditForm from './MemoEditForm'
import { GetMemosParams } from '@/shared/types/api'

interface Props {
  myId: number
  leafs: MemoData[]
  query: GetMemosParams
  setLeafs: Dispatch<SetStateAction<MemoData[]>>
  setCursor: Dispatch<SetStateAction<number | undefined>>
}

export default function LeafList(props: Props) {
  const { myId, leafs, query, setLeafs, setCursor } = props
  const [editId, setEdit] = useState(0)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState('off')
  const beforeQuery = useRef('')

  const loadMoreLeafs = useCallback(() => {
    const cursor = query.cursor
    if (beforeQuery.current === JSON.stringify(query)) return
    beforeQuery.current = JSON.stringify(query)

    if (cursor && cursor < 0) return
    setLoading('on')
    fetchMemos(query)
      .then((result) => {
        setLeafs((prev) => [...prev, ...result.memos])
        setCursor(result.nextCursor)
      })
      .catch()
      .finally(() => setLoading('off'))
  }, [query, setCursor, setLeafs])

  const updateItem = (item: MemoData) => {
    setLeafs((prev) => {
      return prev.map((p) => (p.id !== item.id ? p : { ...p, ...item }))
    })
  }
  const actions = {
    close: () => setEdit(0),
    alert: (text: string) => setMessage(text),
    updateItem,
  }

  const LeafItem = (leaf: MemoData) => {
    const edit = () => setEdit(leaf.id)
    const remove = () => setLeafs((prev) => prev.filter((p) => p.id !== leaf.id))
    const item = <LeafBox {...{ leaf, myId, remove, edit }} />
    const form = <MemoEditForm memo={leaf} {...actions} />
    return { [leaf.id]: item, [editId]: form }[leaf.id]
  }

  const loadingBox = Array(3)
    .fill(0)
    .map((_, i) => {
      return <Skeleton variant="rounded" height={80} key={'loading' + i} />
    })

  return (
    <Stack spacing={2}>
      {leafs.map((leaf: MemoData) => (
        <LeafItem key={'pastLeaf' + leaf.id} {...leaf} />
      ))}

      {{ on: loadingBox, off: null }[loading]}
      <CursorObserver loadMoreItems={loadMoreLeafs} />
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={message ? true : false}
        autoHideDuration={6000}
        onClose={() => setMessage('')}
        message={message}
      />
    </Stack>
  )
}
