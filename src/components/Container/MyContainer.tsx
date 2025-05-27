'use client'
import { Button, Container, Paper, Skeleton } from '@mui/material'
import { MemoData, ProfileData, UserData } from '@/shared/types/client'
import { MyProfile, UserList, UserBox } from '@/components/user'
import { MemoBox, MemoForm, MemoList } from '@/components/memo'
import { useCallback, useState } from 'react'
import { updateMemo } from '@/shared/fetch/memosApi'
import { MemoParams } from '@/shared/types/api'
import { ArrowBack } from '@mui/icons-material'
import DetailContainer from './DetailContainer'
import ContainerTab from './sub/ContainerTab'

interface Props {
  profile: ProfileData
  lastMemoId: number
  lastUserId: number
}

export default function MyContainer({ lastMemoId, lastUserId, profile }: Props) {
  const [posts, setPosts] = useState<MemoData[]>([])
  const [users, setUsers] = useState<UserData[]>([])
  const [aria, setAria] = useState('mypost')
  const [endpoint, setEndpoint] = useState('follower')
  const [detailItem, setDetailItem] = useState<MemoData | undefined>(undefined)
  const [editId, setEdit] = useState(0)

  const addMemoList = useCallback((values: MemoData[]) => {
    setPosts((prev) => [...prev, ...values])
  }, [])

  const addUserList = useCallback((values: UserData[]) => {
    setUsers((prev) => [...prev, ...values])
  }, [])

  const postLoading = [1, 2, 3, 4, 5].map((el) => <Skeleton sx={{ mb: 2 }} variant="rounded" height={120} key={'loading-post' + el} />)

  const userLoading = [1, 2, 3, 4, 5].map((el) => <Skeleton sx={{ mb: 2 }} key={'loading' + el} />)

  const handleUpdateMemo = useCallback(
    (params: MemoParams) => {
      if (!profile) return
      setEdit(0)
      updateMemo(params)
        .then((result) =>
          setPosts((prev) =>
            prev.map((p) => {
              return p.id !== editId ? p : { ...p, ...result }
            })
          )
        )
        .catch()
    },
    [editId, profile]
  )

  const MemoListItem = (memo: MemoData) => {
    const item = (
      <MemoBox
        memo={memo}
        myId={profile.id}
        removeItem={() => setPosts((prev) => prev.filter((p) => p.id !== memo.id))}
        editItem={() => setEdit(memo.id)}
      />
    )
    const editform = (
      <MemoForm action="update" {...memo} onSubmint={handleUpdateMemo}>
        <Button
          color="error"
          onClick={(e) => {
            setEdit(0)
            e.stopPropagation()
          }}
        >
          취소
        </Button>
      </MemoForm>
    )
    return { [memo.id]: item, [editId]: editform }[memo.id]
  }

  const handleClick = (memo: MemoData) => {
    const selection = window.getSelection()
    if (selection && selection.toString().length > 0) return
    setDetailItem(memo)
  }

  const panels = [
    {
      label: '다이어리',
      panel: (
        <MemoList loadingBox={postLoading} aria={aria} id={profile.id} addMemoList={addMemoList} nextCursor={lastMemoId}>
          {posts.map((memo: MemoData) => (
            <Paper variant="outlined" key={'home-memo' + memo.id} onClick={() => handleClick(memo)}>
              <MemoListItem {...memo} />
            </Paper>
          ))}
        </MemoList>
      ),
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
        <UserList user={profile} endpoint={endpoint} nextCursor={lastUserId} loadingBox={userLoading} addUserList={addUserList}>
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
      {detailItem ? (
        <DetailContainer myId={profile.id} firstLoadParent={detailItem}>
          <Button startIcon={<ArrowBack />} onClick={() => setDetailItem(undefined)}>
            목록으로 돌아가기
          </Button>
        </DetailContainer>
      ) : (
        <Container sx={{ mb: 4, minHeight: '100vh' }}>
          <MyProfile {...profile} />
          <ContainerTab
            label={'모아보기'}
            tabs={panels}
            reset={() => {
              setPosts([])
              setUsers([])
            }}
          />
        </Container>
      )}
    </>
  )
}
