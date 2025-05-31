'use client'
import { fetchtUsers } from '@/shared/fetch/usersApi'
import { List, Skeleton, Typography } from '@mui/material'
import { ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import { swapOnOff } from '@/shared/utils/common'
import { UserData } from '@/shared/types/client'

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
  const observerRef = useRef(null)

  useEffect(() => {
    if (isSameEndpoint.current !== endpoint) {
      setCursor(undefined)
      isSameEndpoint.current = endpoint
    }
  }, [endpoint])

  const loadMoreUser = useCallback(() => {
    if (cursor && cursor < 0) return
    setLoading('on')
    fetchtUsers({ endpoint, query: { id: user?.id, cursor, ...query } })
      .then((result) => {
        setCount(result.searchTotal)
        addUserList(result.users)
        setCursor(result.nextCursor)
      })
      .catch()
      .finally(() => setLoading('off'))
  }, [addUserList, cursor, endpoint, query, user?.id])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !swapOnOff[loading].bool) {
          loadMoreUser()
        }
      },
      { threshold: 0.1 }
    )
    if (observerRef.current) {
      observer.observe(observerRef.current)
    }
    return () => observer.disconnect()
  }, [loadMoreUser, loading])

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
      <div ref={observerRef} />
      {{ on: loadingBox, off: null }[loading]}
    </>
  )
}
