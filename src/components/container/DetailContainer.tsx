'use client'
import { Button, Chip, Skeleton, Snackbar } from '@mui/material'
import { ReactNode, useCallback, useMemo, useState } from 'react'
import { MemoData, LeafData } from '@/shared/types/client'
import { checkOnOff, swapOnOff } from '@/shared/utils/common'
import { useRouter } from 'next/navigation'
import MemoBox from '@/components/memo/MemoBox'
import ThreadBox from '@/components/memo/ThreadBox'
import MemoCreateForm from '../memo/MemoCreateForm'
import MemoEditForm from '../memo/MemoEditForm'
import { fetchMemos } from '@/shared/fetch/memosApi'
import CursorObserver from '../common/CursorObserver'

interface Props {
  myId: number
  firstLoadParent: MemoData
  children: ReactNode
}

export default function DetailContainer(props: Props) {
  const { firstLoadParent, myId, children } = props
  const [cursor, setCursor] = useState<undefined | number>(firstLoadParent.id)
  const [message, setMessage] = useState('')
  const [parent, setParent] = useState<MemoData>(firstLoadParent)
  const [leafs, setLeafs] = useState<LeafData[]>([])
  const [editId, setEdit] = useState(0)
  const router = useRouter()
  const isMine = checkOnOff(parent.user.id, myId || 0)
  const [loading, setLoading] = useState('off')
  const [open, setOpen] = useState('off')

  const count = useMemo(() => parent._count?.leafs || 0, [parent._count?.leafs])
  const digit = useMemo(() => (count.toString().length || 0) + 1, [count])

  const addCreatedItem = (item: MemoData) => {
    setLeafs((prev) => [item, ...prev])
  }
  const AddEditedItem = (item: MemoData) => {
    setLeafs((prev) => {
      return prev.map((p) => (p.id !== item.id ? p : { ...p, ...item }))
    })
  }
  const updateParent = (item: MemoData) => {
    setParent((prev) => ({ ...prev, ...item }))
  }
  const removeItem = (itemId: number) => {
    setLeafs((prev) => {
      return prev.filter((p) => p.id !== itemId)
    })
  }

  const loadMoreMemos = useCallback(() => {
    if (open === 'off') return
    if (cursor && cursor < 0) return
    setLoading('on')
    fetchMemos({ id: parent.id, aria: 'thread', cursor })
      .then((result) => {
        setLeafs((prev) => [...prev, ...result.memos])
        setCursor(result.nextCursor)
      })
      .catch()
      .finally(() => setLoading('off'))
  }, [cursor, parent.id, open])

  const openButton = {
    [count]: <Button onClick={() => setOpen((prev) => swapOnOff[prev].next)}>{{ on: '스레드 닫기', off: '스레드 펼치기' }[open]}</Button>,
    0: null,
  }[count]

  const ParentBox = () => {
    const item = <MemoBox theardButton={openButton} memo={parent} remove={() => router.push('/')} edit={() => setEdit(parent.id)} myId={myId} />
    const editForm = <MemoEditForm memo={parent} add={updateParent} close={() => setEdit(0)} alert={(text: string) => setMessage(text)} />
    return { [parent.id]: item, [editId]: editForm }[parent.id]
  }

  const ThreadItem = ({ leaf, index }: { leaf: LeafData; index: number }) => {
    const item = (
      <ThreadBox memo={leaf} isMine={isMine} removeItem={() => removeItem(leaf.id)} editItem={() => setEdit(leaf.id)}>
        <Chip size="small" label={(index + 1).toString().padStart(digit, '0')} />
      </ThreadBox>
    )
    const editForm = <MemoEditForm memo={parent} add={AddEditedItem} close={() => setEdit(0)} alert={(text: string) => setMessage(text)} />
    return { [leaf.id]: item, [editId]: editForm }[leaf.id]
  }

  const creatForm = <MemoCreateForm add={addCreatedItem} parentId={parent.id} alert={(text: string) => setMessage(text)} />

  const leafList = (
    <>
      {leafs.map((leaf: LeafData, index) => {
        return <ThreadItem key={'detail-memo' + leaf.id} leaf={leaf} index={index} />
      })}
      <CursorObserver loadMoreItems={loadMoreMemos} />
    </>
  )

  const loadingBox = Array(3).map((_, i) => {
    return <Skeleton sx={{ mb: 2 }} key={'loading' + i} />
  })

  return (
    <>
      {children}
      <ParentBox />
      {{ on: leafList, off: null }[open]}
      {{ on: loadingBox, off: null }[loading]}
      {{ on: creatForm, off: null }[isMine]}
      <Snackbar open={message ? true : false} autoHideDuration={6000} onClose={() => setMessage('')} message={message} />
    </>
  )
}
