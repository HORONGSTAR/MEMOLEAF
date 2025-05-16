'use client'
import { Paper, MemoForm, MemoList } from '@/components'
import { createMemo, getMemos } from '@/lib/api/memoApi'
import { ActiveNode, Memo, MemoParams } from '@/lib/types'
import { useAppSelector } from '@/store/hooks'
import { Box, Button, Collapse, List } from '@mui/material'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

interface Props {
  id: number
  total: number
  userId: number
}

export default function MemoThread(props: Props) {
  const [memos, setMemos] = useState<Memo[]>([])
  const [newMemos, setNewMemos] = useState<Memo[]>([])
  const { user } = useAppSelector((state) => state.auth)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(Math.ceil(props.total / 10) || 0)
  const formRef = useRef<Element>(null)

  useEffect(() => {
    if (newMemos.length > 0 && formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [newMemos.length])

  const handleGetMemos = useCallback(() => {
    getMemos({ page, limit: 10, parentId: props.id }).then((result) => {
      setMemos((prev) => [...prev, ...result.memos])
      setTotal(result.total)
      setPage((prev) => prev + 1)
    })
  }, [page, props])

  const handleCreateMemo = useCallback(
    (params: Omit<MemoParams, 'id'>) => {
      if (!user) return
      createMemo({ ...params, id: user.id, parentId: props.id })
        .then((memo) => setNewMemos((prev) => [...prev, { ...memo, user }]))
        .catch((err) => console.error(err))
    },
    [user, props.id]
  )

  const firstPage = useMemo(() => page === 1 && total > 0, [total, page])
  const addFormActive = useMemo(() => (user?.id === props.id ? 'on' : 'off'), [user?.id, props.id])
  const pageButtonActive = useMemo(() => (page - 1 !== total ? 'on' : 'off'), [page, total])

  const pageButton: ActiveNode = {
    on: (
      <Button onClick={handleGetMemos}>
        더 보기{page}/{total}
      </Button>
    ),
    off: null,
  }

  const addForm: ActiveNode = {
    on: (
      <Box ref={formRef}>
        <Paper use="create" kind="list">
          <MemoForm onSubmit={handleCreateMemo} placeholder="타래 추가하기" />
        </Paper>
      </Box>
    ),
    off: null,
  }

  return (
    <>
      {firstPage && <Button onClick={handleGetMemos}>{props.total}개의 타래 보기</Button>}
      <Collapse in={!firstPage}>
        <List>
          {memos.map((memo: Memo) => (
            <MemoList key={'memocard' + memo.id} memo={memo} />
          ))}
          {pageButton[pageButtonActive]}
          {newMemos.map((memo: Memo) => (
            <MemoList key={'memocard' + memo.id} memo={memo} />
          ))}
        </List>
      </Collapse>
      {addForm[addFormActive]}
    </>
  )
}
