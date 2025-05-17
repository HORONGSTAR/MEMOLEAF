'use client'
import { TextField, IconButton, Stack, Box, Typography, Button, Divider } from '@mui/material'
import { useCallback, useMemo, useState } from 'react'
import { Search } from '@mui/icons-material'
import { getMemos } from '@/lib/fetch/memoApi'
import { Memo } from '@/lib/types'
import { Paper } from '@/components'
import Link from 'next/link'
import { changeDate } from '@/lib/utills'

export default function SearchBar() {
  const [text, setText] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [memos, setMemos] = useState<Memo[]>([])

  const handleSearch = useCallback(() => {
    if (page === total) return
    const keyword = encodeURIComponent(text)
    getMemos({ page, keyword, limit: 10 }).then((result) => {
      setTotal(result.total)
      setMemos(result.memos)
    })
    if (page < total) setPage((prev) => prev + 1)
  }, [page, text, total])

  const active = useMemo(() => (page !== total && total ? 'on' : 'off'), [page, total])

  const nextButton = {
    on: <Button onClick={handleSearch}>{`더 보기 (${page}/${total})`}</Button>,
    off: (
      <Typography variant="caption" color="textDisabled">
        더 이상 표시할 콘텐츠가 없습니다
      </Typography>
    ),
  }
  return (
    <>
      <Stack direction="row" component="form" justifyContent="center" py={1}>
        <TextField
          size="small"
          label="검색"
          value={text}
          onChange={(e) => {
            setText(e.target.value)
            setPage(1)
            setTotal(0)
          }}
        />
        <IconButton
          type="submit"
          onClick={(e) => {
            e.preventDefault()
            handleSearch()
          }}
        >
          <Search />
        </IconButton>
      </Stack>
      {memos.map((memo) => (
        <Box key={memo.id} component={Link} href={`/page/memo/${memo.id}`}>
          <Paper sx={{ p: 2 }}>
            <Stack direction="row" spacing={1} mb={0.5}>
              <Typography variant="body2" color="primary">
                {memo.user.name}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {changeDate(memo.createdAt)}
              </Typography>
            </Stack>
            <Typography>{memo.content}</Typography>
          </Paper>
        </Box>
      ))}

      <Divider sx={{ my: 4 }} variant="middle">
        {nextButton[active]}
      </Divider>
    </>
  )
}
