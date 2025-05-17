'use client'
import { Paper, MemoForm, MemoBox } from '@/components'
import { createMemo, getMemos } from '@/lib/api/memoApi'
import { Active, ActiveNode, Memo, MemoParams } from '@/lib/types'
import { checkAuthority, swapOnOff } from '@/lib/utills'
import { useAppSelector } from '@/store/hooks'
import { Box, Button, Collapse, Divider, List } from '@mui/material'
import { grey } from '@mui/material/colors'
import { useSession } from 'next-auth/react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

interface Props {
  id: number
  total: number
  userId: number
  formActive: Active
}

export default function MemoThread(props: Props) {
  const [memos, setMemos] = useState<Memo[]>([])
  const [newMemos, setNewMemos] = useState<Memo[]>([])
  const [page, setPage] = useState(1)
  const [open, setOpen] = useState('off')
  const [total, setTotal] = useState(Math.ceil(props.total / 10) || 0)
  const formRef = useRef<Element>(null)
  const { profile } = useAppSelector((state) => state.profile)
  const { data: session } = useSession()
  const isMine = checkAuthority(props.userId, session?.user.id || 0)
  const { formActive } = props

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
      if (!profile) return
      createMemo({ ...params, id: profile.id, parentId: props.id })
        .then((memo) => setNewMemos((prev) => [...prev, { ...memo, user: profile }]))
        .catch((err) => console.error(err))
    },
    [profile, props.id]
  )

  const firstPage = useMemo(() => page === 1 && total > 0, [total, page])
  const pageButtonActive = useMemo(() => (page - 1 !== total ? 'on' : 'off'), [page, total])

  const handleOpen = useCallback(() => {
    if (firstPage) handleGetMemos()
    setOpen((prev) => swapOnOff[prev].next)
  }, [firstPage, handleGetMemos])

  const pageButton: ActiveNode = {
    on: (
      <Divider>
        <Button onClick={handleGetMemos}>
          더 보기{page}/{total}
        </Button>
      </Divider>
    ),
    off: null,
  }

  const addForm: ActiveNode = {
    on: (
      <Box ref={formRef}>
        <Paper use="create" noBorder>
          <MemoForm onSubmit={handleCreateMemo} placeholder="글 추가하기" />
        </Paper>
      </Box>
    ),
    off: null,
  }

  const layout = 'list'

  return (
    <>
      <Button fullWidth sx={{ color: grey[600], bgcolor: grey[100] }} onClick={handleOpen}>
        {{ off: `${props.total}개의 스레드 보기`, on: '스레드 접기' }[open]}
      </Button>
      <Collapse in={swapOnOff[open].bool}>
        <List>
          {memos.map((memo: Memo) => (
            <MemoBox layout={layout} key={'first-memothread' + memo.id} memo={memo} />
          ))}
          {pageButton[pageButtonActive]}
          {newMemos.map((memo: Memo) => (
            <MemoBox layout={layout} key={'last-memothread-l' + memo.id} memo={memo} />
          ))}
        </List>
      </Collapse>
      {{ on: addForm[isMine], off: null }[formActive]}
    </>
  )
}
