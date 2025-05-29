'use client'
import { Button, Snackbar } from '@mui/material'
import { useState } from 'react'
import { MemoData } from '@/shared/types/client'
import MemoList from '@/components/memo/MemoList'
import MemoCreateForm from '@/components/memo/MemoCreateForm'
import DetailContainer from '@/components/container/DetailContainer'
import { ArrowBack } from '@mui/icons-material'

interface Props {
  firstLoadMemos: MemoData[]
  myId: number
}

export default function HomeContainer({ firstLoadMemos, myId }: Props) {
  const [cursor, setCursor] = useState<undefined | number>(firstLoadMemos[9]?.id || undefined)
  const [memos, setMemos] = useState<MemoData[]>(firstLoadMemos || [])
  const [message, setMessage] = useState('')
  const [index, setIndex] = useState<number>(NaN)

  const handleSetIndex = (index: number) => {
    setIndex(index)
  }

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
      <MemoList {...{ myId, memos, query: { cursor, aria: 'home' }, addLoadList, AddEditedItem, removeItem, handleSetIndex }} />
    </>
  )

  const detail = (
    <DetailContainer firstLoadParent={memos[index]} myId={myId}>
      <Button startIcon={<ArrowBack />} onClick={() => setIndex(NaN)}>
        목록으로 돌아가기
      </Button>
    </DetailContainer>
  )

  return (
    <>
      {{ [index]: detail, NaN: home }[index]}
      <Snackbar open={message ? true : false} autoHideDuration={6000} onClose={() => setMessage('')} message={message} />
    </>
  )
}
