'use client'
import { Paper, MemoForm, MemoBox } from '@/components'
import { createMemo, getMemos } from '@/lib/fetch/memoApi'
import { OnOff, OnOffItem, MemoData, MemoParams } from '@/lib/types'
import { checkCurrentOnOff, swapOnOff } from '@/lib/utills'
import { useAppSelector } from '@/store/hooks'
import { Box, Button, Collapse, List } from '@mui/material'
import { grey } from '@mui/material/colors'
import { useSession } from 'next-auth/react'
import { useCallback, useEffect, useRef, useState } from 'react'

interface Props {
  id: number
  count: number
  userId: number
  formActive?: OnOff
}

export default function MemoThread(props: Props) {
  const [memos, setMemos] = useState<MemoData[]>([])
  const [newMemos, setNewMemos] = useState<MemoData[]>([])
  const [page, setPage] = useState(1)
  const [open, setOpen] = useState('off')
  const [total, setTotal] = useState(props.count || 0)
  const formRef = useRef<Element>(null)
  const { profile } = useAppSelector((state) => state.profile)
  const { data: session } = useSession()
  const isMine = checkCurrentOnOff(props.userId, session?.user.id || 0)
  const { formActive } = props
  const limit = 10
  const totalPage = Math.ceil(total / limit)

  useEffect(() => {
    if (newMemos.length > 0 && formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [newMemos.length])

  const handleGetMemos = useCallback(() => {
    getMemos({ category: { thread: props.id }, pagination: { page, limit } }).then((result) => {
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

  const isLast = checkCurrentOnOff(totalPage, page)

  const handleOpen = useCallback(() => {
    if (page === 1) handleGetMemos()
    setOpen((prev) => swapOnOff[prev].next)
  }, [page, handleGetMemos])

  const pageButton: OnOffItem = {
    on: (
      <Button fullWidth sx={{ my: 1 }} onClick={handleGetMemos}>
        더 보기{page - 1}/{totalPage}
      </Button>
    ),
    off: null,
  }

  const addForm: OnOffItem = {
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
      {total ? (
        <Button fullWidth sx={{ color: grey[600], bgcolor: grey[100] }} onClick={handleOpen}>
          {{ off: `${total}개의 스레드 보기`, on: '스레드 접기' }[open]}
        </Button>
      ) : null}
      <List dense>
        <Collapse in={swapOnOff[open].bool}>
          {memos.map((memo: MemoData) => (
            <MemoBox layout={layout} key={'first-memothread' + memo.id} memo={memo} />
          ))}
          {pageButton[isLast]}
        </Collapse>
        {newMemos.map((memo: MemoData) => (
          <MemoBox layout={layout} key={'last-memothread' + memo.id} memo={memo} />
        ))}
      </List>
      {{ on: addForm[isMine], off: null }[formActive || 'off']}
    </>
  )
}
