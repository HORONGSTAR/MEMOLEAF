'use client'
import DetailContainer from '@/components/container/DetailContainer'
import { Button, IconButton, Stack, TextField } from '@mui/material'
import { MemoData, UserData } from '@/shared/types/client'
import { useCallback, useState } from 'react'
import { ArrowBack, Search } from '@mui/icons-material'
import UserList from '@/components/user/UserList'
import UserBox from '@/components/user/UserBox'
import MemoList from '@/components/memo/MemoList'
import TabBox from '../common/TabBox'

interface Props {
  myId: number
}

export default function SearchContainer({ myId }: Props) {
  const [memos, setMemos] = useState<MemoData[]>([])
  const [users, setUsers] = useState<UserData[]>([])
  const [text, setText] = useState('')
  const [keyword, setKeyword] = useState('')
  const [filter, setFilter] = useState({ memo: 'all', user: 'profile' })
  const [cursor, setCursor] = useState<undefined | number>(undefined)
  const [index, setIndex] = useState<number>(NaN)

  const applyDetail = (index: number) => {
    setIndex(index)
  }

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
    setCursor(undefined)
  }, [text])

  const addUserList = useCallback((values: UserData[]) => {
    setUsers((prev) => [...prev, ...values])
  }, [])

  const addItems = (items: MemoData[], nextCursor: number) => {
    setMemos((prev) => [...prev, ...items])
    setCursor(nextCursor)
  }
  const updateItem = (item: MemoData) => {
    setMemos((prev) => {
      return prev.map((p) => (p.id !== item.id ? p : { ...p, ...item }))
    })
  }

  const removeItem = (itemId: number) => {
    setMemos((prev) => {
      return prev.filter((p) => p.id !== itemId)
    })
  }

  const query = { cursor, aria: 'search', filter: filter.memo, keyword }
  const actions = { addItems, updateItem, removeItem, applyDetail }

  const panels = [
    {
      label: '게시글',
      panel: keyword ? <MemoList {...{ myId, memos, query, actions }} /> : null,
      categorys: [
        { label: '통합', value: 'all' },
        { label: '타래글', value: 'thread' },
        { label: '이미지', value: 'images' },
      ],
      select: (category: string) => {
        setFilter((prev) => ({ ...prev, memo: category }))
        setCursor(undefined)
      },
    },
    {
      label: '사용자',
      panel: keyword ? (
        <UserList {...{ endpoint: 'search', addUserList, query: { filter: filter.user, keyword } }}>
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
        setCursor(undefined)
      },
    },
  ]

  const search = (
    <>
      <Stack direction="row" component="form" justifyContent="center" py={1}>
        <TextField size="small" label="검색" value={text} onChange={(e) => handleChange(e.target.value)} />
        <IconButton
          aria-label="검색하기"
          type="submit"
          onClick={(e) => {
            e.preventDefault()
            handleSearch()
          }}
        >
          <Search />
        </IconButton>
      </Stack>
      <TabBox
        label={'검색 결과'}
        tabs={panels}
        reset={() => {
          setMemos([])
          setUsers([])
          setCursor(undefined)
        }}
      />
    </>
  )

  const detail = (
    <DetailContainer firstLoadMemo={memos[index]} {...{ myId, updateItem }}>
      <Button startIcon={<ArrowBack />} onClick={() => setIndex(NaN)}>
        목록으로 돌아가기
      </Button>
    </DetailContainer>
  )

  return { [index]: detail, NaN: search }[index]
}
