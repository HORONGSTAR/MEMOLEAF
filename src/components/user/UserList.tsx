'use client'
import { fetchtUsers } from '@/shared/fetch/usersApi'
import { List, Skeleton, Typography } from '@mui/material'
import { ReactNode, useCallback, useRef, useState } from 'react'
import { UserData } from '@/shared/types/client'
import CursorObserver from '../common/CursorObserver'
import { useAppDispatch } from '@/store/hooks'
import { openAlert } from '@/store/slices/alertSlice'

interface Props {
  children: ReactNode
  endpoint: 'follower' | 'following' | 'search' | string
  user?: { id: number; name: string }
  query?: { filter?: string; keyword?: string }

  addUserList: (values: UserData[]) => void
}

export default function UserList(props: Props) {
  const { user, children, endpoint, query, addUserList } = props
  const [count, setCount] = useState(0)
  const [cursor, setCursor] = useState<undefined | number>(undefined)
  const [loading, setLoading] = useState('off')
  const isSameEndpoint = useRef(endpoint)
  const dispatch = useAppDispatch()

  const loadMoreUser = useCallback(() => {
    if (isSameEndpoint.current !== endpoint) {
      setCursor(undefined)
      isSameEndpoint.current = endpoint
    }
    if (cursor && cursor < 0) return
    setLoading('on')
    fetchtUsers({ endpoint, query: { id: user?.id, ...(cursor && { cursor }), ...query } })
      .then((result) => {
        setCount(result.searchTotal)
        addUserList(result.users)
        setCursor(result.nextCursor)
      })
      .catch((error) => {
        console.error(error)
        dispatch(openAlert({ message: '유저 조회 중 문제가 발생했습니다.', severity: 'error' }))
      })
      .finally(() => setLoading('off'))
  }, [addUserList, cursor, dispatch, endpoint, query, user?.id])

  const followInfo = {
    follower: { [count]: `${user?.name}님의 팔로워 ${count}명`, 0: '팔로워 정보가 없습니다.' }[count],
    following: { [count]: `${user?.name}님의 팔로잉 ${count}명`, 0: '팔로잉 정보가 없습니다.' }[count],
  }[endpoint]

  const loadingBox = Array(3)
    .fill(0)
    .map((_, i) => <Skeleton variant="rounded" height={120} key={'loading' + i} sx={{ mb: 2 }} />)

  return (
    <>
      <Typography variant="body2" color="textSecondary">
        {user ? followInfo : null}
      </Typography>
      <List>{children}</List>
      <CursorObserver loadMoreItems={loadMoreUser} />
      {{ on: loadingBox, off: null }[loading]}
    </>
  )
}
