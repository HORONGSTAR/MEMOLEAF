'use client'
import { MemoData, ProfileData, UserData } from '@/shared/types/client'
import { MyProfile, UserList, UserBox } from '@/components/user'
import { useCallback, useState } from 'react'
import ContainerTab from './sub/ContainerTab'
import MemoConnector from './sub/MemoConnector'

interface Props {
  profile: ProfileData
}

export default function MyContainer({ profile }: Props) {
  const [memos, setMemos] = useState<MemoData[]>([])
  const [users, setUsers] = useState<UserData[]>([])
  const [aria, setAria] = useState('mypost')
  const [endpoint, setEndpoint] = useState('follower')

  const addUserList = useCallback((values: UserData[]) => {
    setUsers((prev) => [...prev, ...values])
  }, [])

  const panels = [
    {
      label: '다이어리',
      panel: <MemoConnector {...{ memos, setMemos, query: { id: profile.id, aria } }} />,
      categorys: [
        { label: `${profile.name}님의 글`, value: 'mypost' },
        { label: '북마크', value: 'bookmark' },
      ],
      select: (category: string) => {
        setAria(category)
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
      },
    },
  ]

  return (
    <>
      <MyProfile {...profile} />
      <ContainerTab
        label={'모아보기'}
        tabs={panels}
        reset={() => {
          setMemos([])
          setUsers([])
        }}
      />
    </>
  )
}
