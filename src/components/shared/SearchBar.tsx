'use client'
import { TextField, IconButton, Stack, Box, Typography, Button, Divider } from '@mui/material'
import { useCallback, useRef, useState } from 'react'
import { Search } from '@mui/icons-material'
import { getMemos } from '@/lib/fetch/memoApi'
import { OnOffItem, MemoData } from '@/lib/types'
import { Paper } from '@/components'
import Link from 'next/link'
import { changeDate } from '@/lib/utills'

export default function SearchBar() {
  const [keyword, setKeyword] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [memos, setMemos] = useState<MemoData[]>([])
  const beforeKeyword = useRef('')

  const handleSearch = useCallback(() => {
    const search = encodeURIComponent(keyword)
    const data = { page, search }
    if (beforeKeyword.current !== keyword) {
      data.page = 1
    }
    getMemos({ pagination: data })
      .then((result) => {
        setTotal(result.total)
        setMemos(result.memos)
        setPage((prev) => prev + 1)
      })
      .catch((error) => console.log(error))
  }, [keyword, page])

  const active = { [page]: 'on', [total]: 'off' }[page]

  const nextButton: OnOffItem = {
    on: <Button onClick={handleSearch}>{`더 보기 (${page}/${total})`}</Button>,
    off: null,
  }
  return (
    <>
      <Stack direction="row" component="form" justifyContent="center" py={1}>
        <TextField size="small" label="검색" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
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
