'use client'
import { Snackbar } from '@mui/material'
import { useState } from 'react'
import { MemoData } from '@/shared/types/client'
import { useSearchParams } from 'next/navigation'
import MemoList from '@/components/memo/MemoList'
import MemoCreateForm from '@/components/memo/MemoCreateForm'
import DetailContainer from '@/components/container/DetailContainer'

interface Props {
  firstLoadMemos: MemoData[]
  myId: number
}

export default function HomeContainer({ firstLoadMemos, myId }: Props) {
  const [cursor, setCursor] = useState<undefined | number>(firstLoadMemos[9]?.id || undefined)
  const [memos, setMemos] = useState<MemoData[]>(firstLoadMemos || [])
  const [message, setMessage] = useState('')
  const searchParams = useSearchParams()
  const index = parseInt(searchParams.get('index') || 'NaN')

  const addCreatedItem = (item: MemoData) => {
    setMemos((prev) => [item, ...prev])
  }

  const addLoadList = (items: MemoData[], nextCursor: number) => {
    setMemos((prev) => [...prev, ...items])
    setCursor(nextCursor)
  }
  const AddEditedItem = (item: MemoData) => {
    setMemos((prev) => {
      return prev.map((p) => (p.id !== item.id ? p : { ...p, ...item }))
    })
  }

  const removeItem = (itemId: number) => {
    setMemos((prev) => {
      return prev.filter((p) => p.id !== itemId)
    })
  }

  const home = (
    <>
      <MemoCreateForm add={addCreatedItem} alert={(text: string) => setMessage(text)} />
      <MemoList {...{ myId, memos, query: { cursor, aria: 'home' }, addLoadList, AddEditedItem, removeItem }} />
    </>
  )

  const detail = <DetailContainer firstLoadParent={memos[index]} myId={myId} />

  return (
    <>
      {{ [index]: detail, NaN: home }[index]}
      <Snackbar open={message ? true : false} autoHideDuration={6000} onClose={() => setMessage('')} message={message} />
    </>
  )
}
