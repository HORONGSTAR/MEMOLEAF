'use client'
import { Avatar, Box, Button, List, ListItem, ListItemAvatar, ListItemText, Stack, Typography } from '@mui/material'
import { CircleNotifications } from '@mui/icons-material'
import { useCallback, useState } from 'react'
import { deleteNotifications, fetchNotifications } from '@/shared/fetch/notificationApi'
import { checkOnOff, imgPath } from '@/shared/utils/common'
import LinkBox from '@/components/common/LinkBox'
import { NotificationsData } from '@/shared/types/client'
import { useRouter } from 'next/navigation'
import CursorObserver from '../common/CursorObserver'
import { useAppDispatch } from '@/store/hooks'
import { openAlert } from '@/store/slices/alertSlice'

interface Props {
  firstLoadData: NotificationsData[]
}

export default function NotificationsContainer({ firstLoadData }: Props) {
  const [cursor, setCursor] = useState<undefined | number>(firstLoadData[9]?.id || -1)
  const [notifications, setNotifications] = useState<NotificationsData[]>(firstLoadData || [])
  const [count, setCount] = useState(notifications.length || 0)
  const router = useRouter()
  const dispatch = useAppDispatch()

  const loadMoreNotifications = useCallback(() => {
    if (firstLoadData.length < 10 || (cursor && cursor < 0)) return
    fetchNotifications(cursor)
      .then((result) => {
        setNotifications((prev) => [...prev, ...result.notifications])
        setCursor(result.nextCursor)
      })
      .catch((error) => {
        console.error(error)
        dispatch(openAlert({ message: '알림 조회 중 문제가 발생했습니다.', severity: 'error' }))
      })
  }, [cursor, dispatch, firstLoadData.length])

  const handleDelete = useCallback(() => {
    deleteNotifications()
      .then(() => {
        dispatch(openAlert({ message: '알림을 삭제했습니다.' }))
      })
      .catch((error) => {
        console.error(error)
        dispatch(openAlert({ message: '알림 삭제 중 문제가 발생했습니다.', severity: 'error' }))
      })
    setNotifications([])
    setCount(0)
  }, [dispatch])

  const setLink = (data: NotificationsData) =>
    ({
      comment: `/page/detail/${data.memo?.id}`,
      follow: `/page/profile/${data.sander?.id}`,
      favorite: `/page/detail/${data.memo?.id}`,
    }[data.aria])

  const setComment = (data: NotificationsData) =>
    ({
      comment: '님이 내 메모에 타래글을 달았습니다.',
      follow: '님이 나를 팔로우했습니다.',
      favorite: '님이 내 메모를 좋아합니다.',
    }[data.aria])

  const setContent = (data: NotificationsData) =>
    ({
      comment: data.memo?.content,
      follow: data.sander.info,
      favorite: data.memo?.content,
    }[data.aria])

  const components = {
    on: (
      <Stack minHeight={100} alignItems="center" justifyContent="center">
        <CircleNotifications sx={{ mb: 1 }} color="disabled" fontSize="large" />
        <Typography color="textDisabled">새로운 알림이 없습니다.</Typography>
      </Stack>
    ),
    off: (
      <List>
        <ListItem>
          <Box flexGrow={1} />
          <Button onClick={handleDelete}>알림 지우기</Button>
        </ListItem>
        {notifications.map((data, i) => (
          <Box key={data.id} sx={{ cursor: 'pointer' }} onClick={() => router.push(setLink(data))}>
            <ListItem divider={{ [i]: true, [count - 1]: false }[i]}>
              <ListItemAvatar>
                <LinkBox link={`/page/profile/${data.sander.id}`}>
                  <Avatar src={imgPath + data.sander.image} alt={data.sander.name} />
                </LinkBox>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography>
                    <LinkBox variant="body1" link={`/page/profile/${data.sander.id}`}>
                      {data.sander.name}
                    </LinkBox>
                    {setComment(data)}
                  </Typography>
                }
                secondary={
                  <Typography variant="body2" color="textSecondary" noWrap>
                    {setContent(data)}
                  </Typography>
                }
              />
            </ListItem>
          </Box>
        ))}
        <CursorObserver loadMoreItems={loadMoreNotifications} />
      </List>
    ),
  }[checkOnOff(count, 0)]

  return components
}
