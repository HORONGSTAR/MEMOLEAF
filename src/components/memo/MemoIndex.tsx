'use client'
import { Paper, MemoBox, MemoForm, LoginBox } from '@/components'
import { createMemo, getMemos } from '@/lib/fetch/memoApi'
import { Active, ActiveNode, Memo, MemoParams, QueryString } from '@/lib/types'
import { useAppSelector } from '@/store/hooks'
import { Box, Button, CircularProgress, Divider, Stack, Typography } from '@mui/material'
import { useSession } from 'next-auth/react'
import { useCallback, useEffect, useMemo, useState } from 'react'

interface Props {
  queryString?: QueryString
  formActive: Active
}

export default function MemoIndex(props: Props) {
  const [memos, setMemos] = useState<Memo[]>([])
  const [total, setTotal] = useState(1)
  const { profile } = useAppSelector((state) => state.profile)
  const [page, setPage] = useState(2)
  const { queryString, formActive } = props
  const { status } = useSession()

  useEffect(() => {
    getMemos({ page: 1, limit: 10 }).then((result) => {
      setMemos(result.memos)
      setTotal(result.total)
    })
  }, [])

  const handleGetMemos = useCallback(() => {
    getMemos({ page, limit: 10, ...queryString }).then((result) => {
      setMemos((prev) => [...prev, ...result.memos])
      setPage((prev) => prev + 1)
      setTotal(result.total)
    })
  }, [page, queryString])

  const handleCreateMemo = useCallback(
    (params: Omit<MemoParams, 'id'>) => {
      if (!profile) return
      createMemo({ ...params })
        .then((memo) => setMemos((prev) => [{ ...memo, user: profile }, ...prev]))
        .catch((err) => console.error(err))
    },
    [profile]
  )

  const active = useMemo(() => (page - 1 !== total ? 'on' : 'off'), [page, total])

  const pageButton: ActiveNode = {
    on: (
      <Button onClick={handleGetMemos}>
        더 보기{page - 1}/{total}
      </Button>
    ),
    off: (
      <Typography variant="caption" color="textDisabled">
        더 이상 표시할 콘텐츠가 없습니다
      </Typography>
    ),
  }

  const form: ActiveNode = {
    on: (
      <Paper use="create">
        <MemoForm onSubmit={handleCreateMemo} />
      </Paper>
    ),
    off: null,
  }

  const components = {
    authenticated: form[formActive],
    loading: (
      <Stack alignItems="center" justifyContent="center" minHeight={100}>
        <CircularProgress sx={{ m: 'auto' }} />
      </Stack>
    ),
    unauthenticated: (
      <Box sx={{ width: '100%', py: 4 }}>
        <Typography align="center" color="primary" variant="h6">
          로그인 후 기록을 남겨보세요!
        </Typography>
        <Typography align="center" color="primary" variant="body2" gutterBottom>
          소셜로그인으로 간편하게 사용할 수 있어요.
        </Typography>
        <LoginBox />
      </Box>
    ),
  }

  return (
    <>
      {components[status]}
      {memos.map((memo: Memo) => (
        <MemoBox key={'memoindex' + memo.id} memo={memo} layout="card" />
      ))}
      <Divider sx={{ my: 4 }} variant="middle">
        {pageButton[active]}
      </Divider>
    </>
  )
}
