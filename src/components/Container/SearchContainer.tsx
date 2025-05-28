'use client'
import { IconButton, Stack, TextField } from '@mui/material'
import { MemoData, UserData } from '@/shared/types/client'
import { UserList, UserBox } from '@/components/user'
import { useCallback, useState } from 'react'
import ContainerTab from './sub/ContainerTab'
import MemoConnector from './sub/MemoConnector'
import { Search } from '@mui/icons-material'

export default function SearchContainer() {
  const [memos, setMemos] = useState<MemoData[]>([])
  const [users, setUsers] = useState<UserData[]>([])
  const [text, setText] = useState('')
  const [keyword, setKeyword] = useState('')
  const [filter, setFilter] = useState({ memo: 'all', user: 'profile' })

  const handleChange = useCallback((text: string) => {
    setText(text)
    setKeyword('')
    setMemos([])
    setUsers([])
  }, [])

  const handleSearch = useCallback(() => {
    const newKeyword = encodeURIComponent(text)
    setKeyword(newKeyword)
    setText('')
  }, [text])

  const addUserList = useCallback((values: UserData[]) => {
    setUsers((prev) => [...prev, ...values])
  }, [])

  const panels = [
    {
      label: '게시글',
      panel: keyword ? <MemoConnector {...{ memos, setMemos, query: { aria: 'search', filter: filter.memo, keyword } }} /> : null,
      categorys: [
        { label: '통합', value: 'all' },
        { label: '스레드', value: 'thread' },
        { label: '이미지', value: 'images' },
      ],
      select: (category: string) => {
        setFilter((prev) => ({ ...prev, memo: category }))
      },
    },
    {
      label: '사용자',
      panel: keyword ? (
        <UserList {...{ endpoint: 'search', addUserList, filter: filter.user, keyword }}>
          {users.map((user) => (
            <UserBox key={'userlist' + user.id} {...user} />
          ))}
        </UserList>
      ) : null,
      categorys: [
        { label: '프로필', value: 'profile' },
        { label: '유저아이디', value: 'userNum' },
      ],
      select: (category: string) => {
        setFilter((prev) => ({ ...prev, user: category }))
      },
    },
  ]

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
      <ContainerTab
        label={'검색 결과'}
        tabs={panels}
        reset={() => {
          setMemos([])
          setUsers([])
        }}
      />
    </>
  )
}
