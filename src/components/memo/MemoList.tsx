'use client'
import { Paper, MemoBox, MemoForm, AsyncBox } from '@/components'
import { OnOff, OnOffItem, MemoData, MemoParams, EndPoint } from '@/lib/types'
import { checkCurrentOnOff } from '@/lib/utills'
import { useAppSelector } from '@/store/hooks'
import { useAppDispatch } from '@/store/hooks'
import { createMemoThunk, getMemosThunk } from '@/store/slices/memoSlice'
import { Box, Button, Divider, Stack, Typography } from '@mui/material'
import { useCallback, useEffect, useRef, useState } from 'react'

interface Props {
  search?: { keyword: string }
  endpoint?: EndPoint
  formActive?: OnOff
}

export default function MemoList({ search, endpoint, formActive }: Props) {
  const dispatch = useAppDispatch()
  const { profile } = useAppSelector((state) => state.profile)
  const [beforeMemo, setBeforeMemo] = useState<MemoData[]>([])
  const { memos, total, status } = useAppSelector((state) => state.memo)
  const [addItemStyle, setItemStyle] = useState('')
  const [page, setPage] = useState(1)
  const pageRef = useRef<HTMLDivElement>(null)
  const limit = 10
  const totalPage = Math.ceil(total / limit)

  useEffect(() => {
    dispatch(getMemosThunk({ category: endpoint, pagination: { page, limit, ...search } }))
  }, [dispatch, endpoint, search, page])

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

  const isLast = checkCurrentOnOff(totalPage || 1, page)

  const pageButton: OnOffItem = {
    off: (
      <Divider>
        <Button onClick={handleNextPage}>
          더 보기{page}/{totalPage}
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
        <Typography variant="body2" color="textSecondary">
          {search ? <>{total}건의 검색결과</> : null}
        </Typography>
        {form[formActive || 'off']}
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
