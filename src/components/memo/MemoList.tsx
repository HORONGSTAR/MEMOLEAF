'use client'
import { Paper, MemoBox, MemoForm, AsyncBox } from '@/components'
import { OnOffItem, MemoData, MemoParams, EndPoint } from '@/lib/types'
import { checkCurrentOnOff } from '@/lib/utills'
import { useAppSelector } from '@/store/hooks'
import { useAppDispatch } from '@/store/hooks'
import { createMemoThunk, getMemosThunk } from '@/store/slices/memoSlice'
import { Box, Button, Divider, Stack, Typography } from '@mui/material'
import { useCallback, useEffect, useRef, useState } from 'react'

interface Props {
  search?: { keyword: string }
  endpoint?: EndPoint
  path: 'home' | 'my' | 'search'
}

export default function MemoList(props: Props) {
  const { memos, searchTotal, nextCursor, status } = useAppSelector((state) => state.memo)
  const { profile } = useAppSelector((state) => state.profile)
  const { search, endpoint, path } = props
  const [beforeMemo, setBeforeMemo] = useState<MemoData[]>([])
  const [addItemStyle, setItemStyle] = useState('')
  const [cursor, setCursor] = useState(0)
  const pageRef = useRef<HTMLDivElement>(null)
  const isLast = checkCurrentOnOff(searchTotal, memos.length + beforeMemo.length)
  const limit = 10

  const isActiev = {
    form: { home: 'on', my: 'off', search: 'off' }[path],
    layout: { home: 'card', my: 'card', search: 'card' }[path],
  }

  const dispatch = useAppDispatch()
  useEffect(() => {
    const params = {
      category: endpoint,
      pagination: { ...(cursor && { cursor }), limit, ...search },
    }
    dispatch(getMemosThunk(params))
  }, [dispatch, endpoint, search, cursor, limit])

  useEffect(() => {
    if (cursor) {
      setTimeout(() => {
        if (pageRef.current) {
          pageRef.current.scrollIntoView({ behavior: 'smooth' })
        }
      }, 1000)
    }
  }, [cursor])

  const handleNextPage = useCallback(() => {
    setBeforeMemo((prev) => [...memos, ...prev])
    setCursor(nextCursor)
  }, [memos, nextCursor])

  const handleCreateMemo = useCallback(
    (formData: Omit<MemoParams, 'id'>) => {
      if (!profile) return
      const memo = { ...formData, ...(endpoint?.thread && { parentId: endpoint.thread }) }
      setItemStyle('memo_loading_effect')
      dispatch(createMemoThunk({ memo, user: profile }))
        .unwrap()
        .then(() => setItemStyle('memo_create_effect'))
      setTimeout(() => {
        setItemStyle('')
      }, 1000)
    },
    [dispatch, profile, endpoint]
  )

  const pageButton: OnOffItem = {
    off: (
      <Divider>
        <Button onClick={handleNextPage}>더 보기</Button>
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
          {search ? <>{searchTotal}건의 검색결과</> : null}
        </Typography>
        {form[isActiev.form]}
        <Stack spacing={2} className={addItemStyle}>
          {beforeMemo.map((memo: MemoData) => (
            <MemoBox key={'before-loading-memo' + memo.id} memo={memo} layout={isActiev.layout} />
          ))}
          {memos.map((memo: MemoData) => (
            <MemoBox key={'after-loading-memo' + memo.id} memo={memo} layout={isActiev.layout} />
          ))}
          {pageButton[isLast]}
        </Stack>
      </AsyncBox>
      <Box ref={pageRef} />
    </>
  )
}
