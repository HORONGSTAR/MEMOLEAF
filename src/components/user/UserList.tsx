'use client'
import { getUsers } from '@/lib/fetch/userApi'
import { Button, Chip, ChipProps, Divider, List, ListItem, ListItemAvatar, ListItemText, Stack, Typography } from '@mui/material'
import { User } from '@prisma/client'
import { useCallback, useEffect, useRef, useState } from 'react'
import { AsyncBox, Avatar, LinkBox } from '@/components'
import { OnOffItem, Status } from '@/lib/types'
import { checkCurrentOnOff } from '@/lib/utills'

interface Props {
  search?: { keyword: string }
  id?: number
  name?: string
}

export default function UserList({ id, name, search }: Props) {
  const [users, setUsers] = useState<User[]>([])
  const [count, setCount] = useState(0)
  const [aria, setAria] = useState<'follower' | 'following' | 'search'>('follower')
  const [status, setStatus] = useState<Status>('idle')
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const pageRef = useRef<HTMLDivElement>(null)
  const limit = 10
  const totalPage = Math.ceil(total / limit)

  useEffect(() => {
    setStatus('loading')
    let data
    if (search?.keyword) {
      setAria('search')
      data = { pagination: { page, limit, keyword: search.keyword } }
    } else {
      data = { category: { [aria]: id }, pagination: { page, limit } }
    }
    getUsers(data)
      .then((result) => {
        setUsers(result.users)
        setStatus('succeeded')
        setTotal(result.total)
        setCount(result.total)
      })
      .catch(() => setStatus('failed'))
  }, [aria, id, page, search])

  useEffect(() => {
    if (page > 1) {
      setTimeout(() => {
        if (pageRef.current) {
          pageRef.current.scrollIntoView({ behavior: 'smooth' })
        } else {
        }
      }, 1000)
    }
  }, [page])

  const handleNextPage = useCallback(() => {
    setUsers((prev) => [...users, ...prev])
    setPage((prev) => prev + 1)
  }, [users])

  const isLast = checkCurrentOnOff(totalPage || 1, page)

  const pageButton: OnOffItem = {
    off: (
      <Divider>
        <Button onClick={handleNextPage}>
          더 보기{page}/{totalPage}
        </Button>
      </Divider>
    ),
    on: null,
  }

  const chipProps: { from: ChipProps; to: ChipProps } = {
    to: { color: 'default' },
    from: { color: 'default' },
    [aria]: { color: 'primary' },
  }

  const followInfo = {
    following: { [count]: `${name}님이 팔로워 ${count}명`, 0: '팔로워 정보가 없습니다.' }[count],
    follower: { [count]: `${name}님의 팔로잉 ${count}명`, 0: '팔로잉 정보가 없습니다.' }[count],
    search: { [count]: `${count}건의 검색 결과`, 0: '유저 정보가 없습니다.' }[count],
  }[aria]

  return (
    <AsyncBox state={status}>
      <Stack direction="row" spacing={1}>
        {search ? (
          <Typography variant="body2" color="textSecondary">
            유저 ID를 검색하면 정확한 결과가 나옵니다.
          </Typography>
        ) : (
          <>
            <Chip {...chipProps.from} onClick={() => setAria('follower')} label={`팔로잉`} />
            <Chip {...chipProps.to} onClick={() => setAria('following')} label={`팔로워`} />
          </>
        )}
      </Stack>
      <List>
        <ListItem>
          <Typography variant="body2" color="textSecondary">
            {followInfo}
          </Typography>
        </ListItem>
        {users.map((user) => (
          <ListItem key={'followList' + user.id} alignItems="flex-start" divider>
            <ListItemAvatar>
              <LinkBox link={`/page/my/${user.id}`}>
                <Avatar user={user} size={40} />
              </LinkBox>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Stack direction="row" spacing={1}>
                  <LinkBox link={`/page/my/${user.id}`}>{user.name}</LinkBox>
                  <Typography variant="body2" color="textDisabled">
                    ID {user.userNum}
                  </Typography>
                </Stack>
              }
              secondary={user.info || '자기소개가 없습니다.'}
            />
          </ListItem>
        ))}
        {pageButton[isLast]}
      </List>
    </AsyncBox>
  )
}
