'use client'
import { TextField, IconButton, Stack, Container } from '@mui/material'
import { useCallback, useState } from 'react'
import { Search } from '@mui/icons-material'
import ContainerTab from './sub/ContainerTab'

export default function SearchContainer() {
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

  return (
    <Container sx={{ mb: 4, minHeight: '100vh' }}>
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
      <ContainerTab />
    </Container>
  )
}
