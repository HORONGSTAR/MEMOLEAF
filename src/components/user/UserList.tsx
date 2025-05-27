'use client'
import { fetchtFollow } from '@/shared/fetch/usersApi'
import { List, Typography } from '@mui/material'
import { ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import { swapOnOff } from '@/shared/utils/common'
import { UserData } from '@/shared/types/client'

interface Props {
  user: { id: number; name: string }
  nextCursor: number
  children: ReactNode
  loadingBox: ReactNode
  endpoint: 'follower' | 'following' | string
  addUserList: (values: UserData[]) => void
}

export default function UserList(props: Props) {
  const { user, nextCursor, loadingBox, children, endpoint, addUserList } = props
  const [count, setCount] = useState(0)
  const [cursor, setCursor] = useState(nextCursor)
  const [loading, setLoading] = useState('off')
  const isSameEndpoint = useRef(endpoint)
  const observerRef = useRef(null)

  useEffect(() => {
    if (isSameEndpoint.current !== endpoint) {
      setCursor(nextCursor)
      isSameEndpoint.current = endpoint
    }
  }, [endpoint, nextCursor])

  const loadMoreUser = useCallback(() => {
    if (cursor < 0) return
    setLoading('on')
    fetchtFollow({ id: user.id, endpoint, cursor })
      .then((result) => {
        setCount(result.searchTotal)
        addUserList(result.users)
        setCursor(result.nextCursor)
      })
      .catch()
      .finally(() => setLoading('off'))
  }, [addUserList, cursor, endpoint, user.id])

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
    follower: { [count]: `${user.name}님의 팔로워 ${count}명`, 0: '팔로워 정보가 없습니다.' }[count],
    following: { [count]: `${user.name}님의 팔로잉 ${count}명`, 0: '팔로잉 정보가 없습니다.' }[count],
  }[endpoint]

  return (
    <>
      <Typography variant="body2" color="textSecondary">
        {followInfo}
      </Typography>
      <List>{children}</List>
      <div ref={observerRef} />
      {{ on: loadingBox, off: null }[loading]}
    </>
  )
}
