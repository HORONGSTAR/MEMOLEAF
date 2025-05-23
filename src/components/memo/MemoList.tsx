'use client'
import { MemoBox, MemoForm } from '@/components/memo'
import { createMemo, getMemos } from '@/lib/fetch/memoApi'
import { OnOffItem, MemoData, MemoParams, EndPoint } from '@/lib/types'
import { useAppSelector } from '@/store/hooks'
import { CircularProgress, Divider, Paper, Skeleton, Stack, Typography, useTheme } from '@mui/material'
import { useCallback, useEffect, useRef, useState } from 'react'
import MemoThread from './MemoThread'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { green } from '@mui/material/colors'
import LoginBanner from '../auth/LoginBanner'

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
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState('off')
  const theme = useTheme()
  const { status } = useSession()

  const limit = 10
  const observerRef = useRef(null)

  const isActiev = {
    form: { home: 'on', my: 'off', search: 'off' }[path],
  }

  const loadMoreMemos = useCallback(() => {
    setLoading('on')
    const params = {
      category: endpoint,
      pagination: { cursor, limit, ...search },
    }
    getMemos(params)
      .then((result) => {
        setMemos((prev) => [...prev, ...result.memos])
        setCursor(result.nextCursor)
        setTotal(result.searchTotal)
      })
      .catch()
      .finally(() => setLoading('off'))
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
  }, [loadMoreMemos])

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

  const components = {
    authenticated: form[isActiev.form],
    loading: (
      <Stack alignItems="center" justifyContent="center" minHeight={200}>
        <CircularProgress />
      </Stack>
    ),
    unauthenticated: {
      on: (
        <Stack
          direction={{ sm: 'row', xs: 'column' }}
          sx={{ bgcolor: green[50], borderRadius: 1, p: 2 }}
          justifyContent="space-around"
          alignItems="center"
        >
          <Image src={'/undraw_development_s4gv.svg'} alt="의견을 게시하는 사람들" width={250} height={120} priority />
          <Stack maxWidth={300} spacing={2} alignItems="center">
            <Stack alignItems="center">
              <Typography color="primary" variant="h6">
                메모리프에 오신 걸 환영합니다!
              </Typography>
              <Typography color="primary" variant="body2">
                메모리프는 공용 테이블에 펼쳐진 낙서장 같은 공간이에요. 일상적인 기록을 남기고, 다른 사람의 기록도 구경하세요.
              </Typography>
            </Stack>
            <Divider flexItem>
              <Typography variant="caption" color="textSecondary">
                소셜 로그인
              </Typography>
            </Divider>
            <LoginBanner />
          </Stack>
        </Stack>
      ),
      off: null,
    }[isActiev.form],
  }[status]

  return (
    <>
      <Typography variant="body2" color="textSecondary">
        {search ? <>{total}건의 검색결과</> : null}
      </Typography>
      {components}
      {
        {
          on: (
            <>
              <Skeleton variant="rounded" height={160} />
              <Skeleton variant="rounded" height={160} />
              <Skeleton variant="rounded" height={160} />
              <Skeleton variant="rounded" height={160} />
            </>
          ),
          off: null,
        }[loading]
      }
      <Stack spacing={2} className={addItemStyle}>
        {memos.map((memo: MemoData) => (
          <Paper variant="outlined" key={'home-memo' + memo.id}>
            <MemoBox memo={memo} layout="list" thread={<MemoThread id={memo.id} count={memo._count?.leafs || 0} />} />
          </Paper>
        ))}
      </Stack>
      {
        {
          on: (
            <Stack alignItems="center" justifyContent="center" minHeight={200}>
              <CircularProgress />
            </Stack>
          ),
          off: null,
        }[loading]
      }
      <div ref={observerRef} />
    </>
  )
}
