'use client'
import { MemoData, ProfileData, UserData } from '@/shared/types/client'
import { MyProfile, UserList, UserBox } from '@/components/user'
import { useCallback, useMemo, useState } from 'react'
import DetailContainer from '@/components/container/DetailContainer'
import MemoList from '@/components/memo/MemoList'
import TabBox from '../common/TabBox'
import { ArrowBack } from '@mui/icons-material'
import { Button } from '@mui/material'

interface Props {
  profile: ProfileData
  myId: number
}

export default function MyContainer({ profile, myId }: Props) {
  const [memos, setMemos] = useState<MemoData[]>([])
  const [users, setUsers] = useState<UserData[]>([])
  const [aria, setAria] = useState('mypost')
  const [endpoint, setEndpoint] = useState('follower')
  const [cursor, setCursor] = useState<undefined | number>(undefined)
  const [index, setIndex] = useState<number>(NaN)

  const handleSetIndex = (index: number) => {
    setIndex(index)
  }

  const addUserList = useCallback((values: UserData[]) => {
    setUsers((prev) => [...prev, ...values])
  }, [])

  const addLoadList = (items: MemoData[], nextCursor: number) => {
    setMemos((prev) => [...prev, ...items])
    setCursor(nextCursor)
  }
  const AddEditedItem = (item: MemoData) => {
    setMemos((prev) => {
      return prev.map((p) => (p.id !== item.id ? p : { ...p, ...item }))
    })
  }

  const removeItem = (itemId: number) => {
    setMemos((prev) => {
      return prev.filter((p) => p.id !== itemId)
    })
  }

  const query = useMemo(() => ({ id: profile.id, aria, cursor }), [aria, cursor, profile.id])

  const panels = [
    {
      label: '다이어리',
      panel: <MemoList {...{ myId, memos, removeItem, AddEditedItem, addLoadList, query, handleSetIndex }} />,
      categorys: [
        { label: `${profile.name}님의 글`, value: 'mypost' },
        { label: '북마크', value: 'bookmark' },
      ],
      select: (category: string) => {
        setAria(category)
        setCursor(undefined)
      },
    },
    {
      label: '팔로우',
      panel: (
        <UserList user={profile} endpoint={endpoint} addUserList={addUserList}>
          {users.map((user) => (
            <UserBox key={'userlist' + user.id} {...user} />
          ))}
        </UserList>
      ),
      categorys: [
        { label: '팔로워', value: 'follower' },
        { label: '팔로잉', value: 'following' },
      ],
      select: (category: string) => {
        setEndpoint(category)
        setCursor(undefined)
      },
    },
  ]

  const my = (
    <>
      <MyProfile {...profile} />
      <TabBox
        label={'모아보기'}
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
    <DetailContainer firstLoadParent={memos[index]} myId={myId}>
      <Button startIcon={<ArrowBack />} onClick={() => setIndex(NaN)}>
        목록으로 돌아가기
      </Button>
    </DetailContainer>
  )

  return { [index]: detail, NaN: my }[index]
}
