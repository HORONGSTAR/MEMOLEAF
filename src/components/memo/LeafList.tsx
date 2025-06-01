'use client'
import { fetchMemos } from '@/shared/fetch/memosApi'
import { Skeleton, Stack } from '@mui/material'
import { Dispatch, SetStateAction, useCallback, useRef, useState } from 'react'
import { MemoData } from '@/shared/types/client'
import CursorObserver from '@/components/common/CursorObserver'
import LeafBox from './LeafBox'
import MemoEditForm from './MemoEditForm'
import { GetMemosParams } from '@/shared/types/api'
import { useAppDispatch } from '@/store/hooks'
import { openAlert } from '@/store/slices/alertSlice'

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
  const [loading, setLoading] = useState('off')
  const beforeQuery = useRef('')

  const dispatch = useAppDispatch()
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
      .catch(({ message }) => {
        dispatch(openAlert({ message, severity: 'error' }))
      })
      .finally(() => setLoading('off'))
  }, [dispatch, query, setCursor, setLeafs])

  const updateItem = (item: MemoData) => {
    setLeafs((prev) => {
      return prev.map((p) => (p.id !== item.id ? p : { ...p, ...item }))
    })
  }
  const actions = {
    close: () => setEdit(0),
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
    </Stack>
  )
}
