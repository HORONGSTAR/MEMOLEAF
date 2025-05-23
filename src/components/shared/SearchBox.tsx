'use client'
import { TextField, IconButton, Stack, Box, Divider, Tab, Tabs } from '@mui/material'
import { ReactNode, useCallback, useState } from 'react'
import { Search } from '@mui/icons-material'
import { MemoList } from '@/components/memo'
import { UserList } from '@/components/user'
import { OnOffItem } from '@/lib/types'

export default function SearchBar({ lastMemoId }: { lastMemoId: number }) {
  const [value, setValue] = useState(0)
  const [text, setText] = useState('')
  const [keyword, setKeyword] = useState('')
  const [active, setActive] = useState('off')

  const handleChange = useCallback((text: string) => {
    setText(text)
    setActive('off')
  }, [])

  const handleSearch = useCallback(() => {
    const newKeyword = encodeURIComponent(text)
    setKeyword(newKeyword)
    setText('')
    setActive('on')
  }, [text])

  const labels = ['게시글', '사용자']

  const items: { [key: number]: ReactNode } = {
    0: <MemoList search={{ keyword }} path={'search'} lastMemoId={lastMemoId} />,
    1: <UserList search={{ keyword }} />,
  }

  const resultList: OnOffItem = { on: items[value], off: null }

  return (
    <>
      <Stack direction="row" component="form" justifyContent="center" py={1}>
        <TextField size="small" label="검색" value={text} onChange={(e) => handleChange(e.target.value)} />
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
      <Box sx={{ width: '100%' }}>
        <Box>
          <Tabs value={value} onChange={(_, newValue) => setValue(newValue)} aria-label="모아보기">
            {labels.map((label, i) => (
              <Tab key={`tab${i}`} label={label} id={`tab${i}`} aria-controls={`panel${i}`} />
            ))}
          </Tabs>
        </Box>
        <Divider />
        <Box key={`panel${value}`} role={`panel${value}`} id={`panel${value}`} aria-labelledby={`tab${value}`} hidden={value !== value} pt={2}>
          <Stack spacing={2}>{resultList[active]}</Stack>
        </Box>
      </Box>
    </>
  )
}
