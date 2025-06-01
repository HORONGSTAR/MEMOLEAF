'use client'
import { Snackbar, Stack } from '@mui/material'
import { useCallback, useEffect, useRef, useState } from 'react'
import { MemoData } from '@/shared/types/client'
import LeafBox from './LeafBox'
import MemoEditForm from './MemoEditForm'
import MemoCreateForm from './MemoCreateForm'

interface Props {
  myId: number
  memo: MemoData
  updateItem: (item: MemoData) => void
}

export default function LeafCreateForm(props: Props) {
  const { myId, memo, updateItem } = props
  const [message, setMessage] = useState('')
  const [leafs, setLeafs] = useState<MemoData[]>([])
  const [editId, setEdit] = useState(0)
  const formRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (formRef.current) {
      setTimeout(() => {
        formRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        })
      }, 100)
    }
  }, [leafs.length])

  const actions = { close: () => setEdit(0), alert: (text: string) => setMessage(text) }
  const updateLeaf = (item: MemoData) => {
    setLeafs((prev) => {
      return prev.map((p) => (p.id !== item.id ? p : { ...p, ...item }))
    })
  }

  const addCreatedLeaf = useCallback(
    (item: MemoData) => {
      setLeafs((prev) => [...prev, item])
      updateItem({ ...memo, _count: { ...memo._count, leafs: memo._count.leafs + 1 } })
    },
    [memo, updateItem]
  )

  const LeafItem = (leaf: MemoData) => {
    const edit = () => setEdit(leaf.id)
    const remove = () => setLeafs((prev) => prev.filter((p) => p.id !== leaf.id))
    const item = <LeafBox {...{ leaf, myId, remove, edit }} />
    const form = <MemoEditForm memo={leaf} {...actions} updateItem={updateLeaf} />
    return { [leaf.id]: item, [editId]: form }[leaf.id]
  }

  return (
    <Stack spacing={2} my={2}>
      {leafs.map((leaf: MemoData) => (
        <LeafItem key={'thread' + leaf.id} {...leaf} />
      ))}
      <MemoCreateForm add={addCreatedLeaf} titleId={memo.id} alert={(text: string) => setMessage(text)} />
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={message ? true : false}
        autoHideDuration={6000}
        onClose={() => setMessage('')}
        message={message}
      />
      <div ref={formRef} />
    </Stack>
  )
}
