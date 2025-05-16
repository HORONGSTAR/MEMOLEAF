'use client'
import { Paper, LoginBox, MemoCard, MemoForm } from '@/components'
import { createMemo, getMemos } from '@/lib/api/memoApi'
import { ActiveNode, Memo, MemoParams, QueryString } from '@/lib/types'
import { useAppSelector } from '@/store/hooks'
import { Box, Button, Divider, Typography } from '@mui/material'
import { useSession } from 'next-auth/react'
import { useCallback, useMemo, useState } from 'react'

interface Props {
  memos: Memo[]
  total: number
  queryString: QueryString
}

export default function MemoIndex(props: Props) {
  const [memos, setMemos] = useState<Memo[]>(props.memos.length > 0 ? props.memos : [])
  const [total, setTotal] = useState(props.total || 1)
  const { user } = useAppSelector((state) => state.auth)
  const [page, setPage] = useState(2)
  const { queryString } = props
  const { data: session } = useSession()
  const auth = session?.user

  const handleGetMemos = useCallback(() => {
    getMemos({ page, limit: 10, ...queryString }).then((result) => {
      setMemos((prev) => [...prev, ...result.memos])
      setPage((prev) => prev + 1)
      setTotal(result.total)
    })
  }, [page, queryString])

  const handleCreateMemo = useCallback(
    (params: Omit<MemoParams, 'id'>) => {
      if (!user) return
      createMemo({ ...params, id: user.id })
        .then((memo) => setMemos((prev) => [{ ...memo, user }, ...prev]))
        .catch((err) => console.error(err))
    },
    [user]
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

  if (!auth) {
    return (
      <Box sx={{ px: 10 }}>
        <Typography align="center" color="primary" variant="h6">
          로그인 후 기록을 남겨보세요!
        </Typography>
        <Typography align="center" color="primary" variant="body2" gutterBottom>
          소셜로그인으로 간편하게 사용할 수 있어요.
        </Typography>
        <LoginBox />
      </Box>
    )
  }

  return (
    <>
      {!queryString && (
        <Paper use="create" kind="card">
          <MemoForm onSubmit={handleCreateMemo} />
        </Paper>
      )}
      {memos.map((memo: Memo) => (
        <MemoCard key={'memocard' + memo.id} memo={memo} />
      ))}
      <Divider sx={{ my: 4 }} variant="middle">
        {pageButton[active]}
      </Divider>
    </>
  )
}
