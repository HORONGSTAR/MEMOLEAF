'use client'
import { fetchtFollow } from '@/shared/fetch/usersApi'
import { Chip, ChipProps, List, Typography } from '@mui/material'
import { ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import { swapOnOff } from '@/shared/utils/common'
import { UserData } from '@/shared/types/client'

interface Props {
  user: { id: number; name: string }
  nextCursor: number
  children: ReactNode
  loadingBox: ReactNode
  addUserList: (values: UserData[]) => void
}

type EndPoint = 'follower' | 'following'

export default function UserList(props: Props) {
  const { user, nextCursor, loadingBox, children, addUserList } = props
  const [endpoint, setEndPoint] = useState<EndPoint>('follower')
  const [count, setCount] = useState(0)
  const [cursor, setCursor] = useState(nextCursor)
  const [loading, setLoading] = useState('off')
  const observerRef = useRef(null)

  const loadMoreUser = useCallback(() => {
    if (cursor < 0) return
    setLoading('on')
    fetchtFollow({ id: user.id, endpoint })
      .then((result) => {
        setCount(result.searchTotal)
        addUserList(result.memos)
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
    following: { [count]: `${name}님이 팔로워 ${count}명`, 0: '팔로워 정보가 없습니다.' }[count],
    follower: { [count]: `${name}님의 팔로잉 ${count}명`, 0: '팔로잉 정보가 없습니다.' }[count],
  }[endpoint]

  const chipProps: { follower: ChipProps; following: ChipProps } = {
    follower: { color: 'default' },
    following: { color: 'default' },
    [endpoint]: { color: 'primary' },
  }

  return (
    <>
      <Chip {...chipProps.follower} onClick={() => setEndPoint('follower')} label={`팔로잉`} />
      <Chip {...chipProps.following} onClick={() => setEndPoint('following')} label={`팔로워`} />
      <Typography variant="body2" color="textSecondary">
        {followInfo}
      </Typography>
      <List>{children}</List>
      <div ref={observerRef} />
      {{ on: loadingBox, off: null }[loading]}
    </>
  )
}
