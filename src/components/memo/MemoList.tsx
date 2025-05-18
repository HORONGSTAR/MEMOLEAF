'use client'
import { Paper, MemoBox, MemoForm, AsyncBox } from '@/components'
import { OnOff, OnOffItem, MemoData, MemoParams, QueryString } from '@/lib/types'
import { checkCurrentOnOff } from '@/lib/utills'
import { useAppSelector } from '@/store/hooks'
import { useAppDispatch } from '@/store/hooks'
import { createMemoThunk, getMemosThunk } from '@/store/slices/memoSlice'
import { Box, Button, Divider, Stack } from '@mui/material'
import { useCallback, useEffect, useRef, useState } from 'react'

interface Props {
  queryString?: QueryString
  formActive?: OnOff
}

export default function MemoList(props: Props) {
  const dispatch = useAppDispatch()
  const { profile } = useAppSelector((state) => state.profile)
  const [beforeMemo, setBeforeMemo] = useState<MemoData[]>([])
  const { memos, total, status } = useAppSelector((state) => state.memo)
  const [addItemStyle, setItemStyle] = useState('')
  const [page, setPage] = useState(1)
  const pageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    dispatch(getMemosThunk({ pagination: { page, limit: 10 } }))
  }, [dispatch, page])

  useEffect(() => {
    if (page > 1) {
      setTimeout(() => {
        if (pageRef.current) {
          pageRef.current.scrollIntoView({ behavior: 'smooth' })
        }
      }, 1000)
    }
  }, [page])

  const handleNextPage = useCallback(() => {
    setBeforeMemo((prev) => [...memos, ...prev])
    setPage((prev) => prev + 1)
  }, [memos])

  const handleCreateMemo = useCallback(
    (formData: Omit<MemoParams, 'id'>) => {
      if (!profile) return
      setItemStyle('memo_loading_effect')
      dispatch(createMemoThunk({ memo: formData, user: profile }))
        .unwrap()
        .then(() => setItemStyle('memo_create_effect'))
      setTimeout(() => {
        setItemStyle('')
      }, 1000)
    },
    [dispatch, profile]
  )

  const isLast = checkCurrentOnOff(total, page)

  const pageButton: OnOffItem = {
    off: (
      <Divider>
        <Button onClick={handleNextPage}>
          더 보기{page}/{total}
        </Button>
      </Divider>
    ),
    on: null,
  }

  const form: OnOffItem = {
    on: (
      <Paper use="create">
        <MemoForm onSubmit={handleCreateMemo} />
      </Paper>
    ),
    off: null,
  }

  return (
    <>
      <AsyncBox state={status}>
        {form[props.formActive || 'off']}
        <Stack spacing={2} className={addItemStyle}>
          {beforeMemo.map((memo: MemoData) => (
            <MemoBox key={'before-loading-memo' + memo.id} memo={memo} layout="card" />
          ))}
          {memos.map((memo: MemoData) => (
            <MemoBox key={'after-loading-memo' + memo.id} memo={memo} layout="card" />
          ))}
          {pageButton[isLast]}
        </Stack>
      </AsyncBox>
      <Box ref={pageRef} />
    </>
  )
}
