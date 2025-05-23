'use client'
import { MemoBox, MemoForm } from '@/components/memo'
import { createMemo, getMemos } from '@/lib/fetch/memoApi'
import { OnOffItem, MemoData, MemoParams, EndPoint } from '@/lib/types'
import { useAppSelector } from '@/store/hooks'
import { Paper, Stack, Typography, useTheme } from '@mui/material'
import { useCallback, useEffect, useRef, useState } from 'react'
import MemoThread from './MemoThread'

interface Props {
  search?: { keyword: string }
  endpoint?: EndPoint
  path: 'home' | 'my' | 'search'
  lastMemoId: number
}

export default function MemoList(props: Props) {
  const { profile } = useAppSelector((state) => state.profile)
  const { search, endpoint, path, lastMemoId } = props
  const [memos, setMemos] = useState<MemoData[]>([])
  const [addItemStyle, setItemStyle] = useState('')
  const [cursor, setCursor] = useState(lastMemoId + 1)
  const [loading, setLoading] = useState(false)
  const theme = useTheme()

  const limit = 10
  const observerRef = useRef(null)

  const isActiev = {
    form: { home: 'on', my: 'off', search: 'off' }[path],
  }

  const loadMoreMemos = useCallback(() => {
    const params = {
      category: endpoint,
      pagination: { cursor, limit, ...search },
    }
    getMemos(params)
      .then((result) => {
        setMemos((prev) => [...prev, ...result.memos])
        setCursor(result.nextCursor)
      })
      .catch()
      .finally(() => setLoading(false))
  }, [endpoint, search, cursor, limit])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          loadMoreMemos()
        }
      },
      { threshold: 0.1 }
    )
    if (observerRef.current) {
      observer.observe(observerRef.current)
    }
    return () => observer.disconnect()
  }, [loading, loadMoreMemos])

  const handleCreateMemo = useCallback(
    (formData: Omit<MemoParams, 'id'>) => {
      if (!profile) return
      const memo = { ...formData }
      setItemStyle('memo_loading_effect')
      createMemo({ ...memo }).then((result) => {
        setItemStyle('memo_create_effect')
        setMemos((prev) => [{ ...result, user: profile }, ...prev])
      })
      setTimeout(() => {
        setItemStyle('')
      }, 1000)
    },
    [profile]
  )

  const form: OnOffItem = {
    on: (
      <Paper variant="outlined" sx={{ bgcolor: theme.palette.secondary.light, p: 1 }}>
        <MemoForm onSubmit={handleCreateMemo} />
      </Paper>
    ),
    off: null,
  }

  return (
    <>
      <Typography variant="body2" color="textSecondary">
        {search ? <>건의 검색결과</> : null}
      </Typography>
      {form[isActiev.form]}
      <Stack spacing={2} className={addItemStyle}>
        {memos.map((memo: MemoData) => (
          <Paper variant="outlined" key={'home-memo' + memo.id}>
            <MemoBox memo={memo} layout="list" thread={<MemoThread id={memo.id} count={memo._count?.leafs || 0} />} />
          </Paper>
        ))}
      </Stack>
      <div ref={observerRef} />
    </>
  )
}
