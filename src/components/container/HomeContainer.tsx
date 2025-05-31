'use client'
import { Button, Snackbar } from '@mui/material'
import { useState } from 'react'
import { MemoData } from '@/shared/types/client'
import MemoList from '@/components/memo/MemoList'
import MemoCreateForm from '@/components/memo/MemoCreateForm'
import DetailContainer from '@/components/container/DetailContainer'
import { ArrowBack } from '@mui/icons-material'
import Welcome from '../auth/Welcome'

interface Props {
  firstLoadMemos: MemoData[]
  myId: number
}

export default function HomeContainer({ firstLoadMemos, myId }: Props) {
  const [cursor, setCursor] = useState<undefined | number>(firstLoadMemos[9]?.id || -1)
  const [memos, setMemos] = useState<MemoData[]>(firstLoadMemos || [])
  const [message, setMessage] = useState('')
  const [index, setIndex] = useState<number>(NaN)

  const applyDetail = (index: number) => {
    setIndex(index)
  }

  const addCreatedItem = (item: MemoData) => {
    setMemos((prev) => [item, ...prev])
  }

  const addItems = (items: MemoData[], nextCursor: number) => {
    setMemos((prev) => [...prev, ...items])
    setCursor(nextCursor)
  }
  const updateItem = (item: MemoData) => {
    setMemos((prev) => {
      return prev.map((p) => (p.id !== item.id ? p : { ...p, ...item }))
    })
  }

  const removeItem = (itemId: number) => {
    setIndex(NaN)
    setMemos((prev) => {
      return prev.filter((p) => p.id !== itemId)
    })
  }

  const actions = { addItems, updateItem, removeItem, applyDetail }

  const form = <MemoCreateForm add={addCreatedItem} alert={(text: string) => setMessage(text)} />

  const home = (
    <>
      {{ [myId]: form, 0: <Welcome /> }[myId]}
      <MemoList {...{ myId, memos, query: { cursor, aria: 'home' }, actions }} />
    </>
  )
  const detail = (
    <DetailContainer firstLoadMemo={memos[index]} {...{ myId, updateItem, removeItem }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => {
          setIndex(NaN)
        }}
      >
        목록으로 돌아가기
      </Button>
    </DetailContainer>
  )

  return (
    <>
      {{ [index]: detail, NaN: home }[index]}
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={message ? true : false}
        autoHideDuration={6000}
        onClose={() => setMessage('')}
        message={message}
      />
    </>
  )
}
