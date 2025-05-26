'use client'
import { Badge, Box, Button, IconButton, List, ListItem, ListItemAvatar, Stack, Typography } from '@mui/material'
import { CircleNotifications, Notifications } from '@mui/icons-material'
import { useCallback, useEffect, useState } from 'react'
import { fetchAlarm, deleteAlarm } from '@/shared/fetch/alarmApi'
import { Avatar, Dialog, LinkBox } from '@/components/common'
import { Alarm, User } from '@prisma/client'
import { useSession } from 'next-auth/react'
import { checkOnOff } from '@/shared/utils/common'

interface AlarmData extends Alarm {
  reader: User
}

export default function AlarmBox() {
  const [open, setOpen] = useState(false)
  const [alarms, setAlarms] = useState<AlarmData[]>([])
  const [count, setCount] = useState(0)
  const { data: session } = useSession()
  const userId = session?.user.id

  useEffect(() => {
    fetchAlarm()
      .then((result) => {
        setCount(result.count)
        setAlarms(result.alarms)
      })
      .catch((err) => console.error(err))
  }, [userId])

  const handleDelete = useCallback(() => {
    deleteAlarm()
    setAlarms([])
    setCount(0)
  }, [])

  if (!userId) return null
  const components = {
    on: (
      <Stack minHeight={100} alignItems="center" justifyContent="center">
        <CircleNotifications sx={{ mb: 1 }} color="disabled" fontSize="large" />
        <Typography color="textDisabled">새로운 알림이 없습니다.</Typography>
      </Stack>
    ),
    off: (
      <List>
        {alarms.map((alarm) => (
          <ListItem key={alarm.id}>
            <LinkBox link={`/page/my/${alarm.readerId}`}>
              <ListItemAvatar>
                <Avatar user={alarm.reader} size={40} />
              </ListItemAvatar>
            </LinkBox>
            <LinkBox
              variant="body2"
              color="textPrimary"
              link={
                {
                  comment: `/page/detail/${alarm.linkId}`,
                  follow: `/page/my/${alarm.linkId}`,
                  bookmark: `/page/detail/${alarm.linkId}`,
                }[alarm.aria]
              }
            >
              {
                {
                  comment: `${alarm.reader.name}님이 내 메모에 댓글을 달았습니다.`,
                  follow: `${alarm.reader.name}님이 나를 팔로우했습니다.`,
                  bookmark: `${alarm.reader.name}님이 내 메모를 북마크했습니다.`,
                }[alarm.aria]
              }
            </LinkBox>
          </ListItem>
        ))}
        <ListItem>
          <Box flexGrow={1} />
          <Button onClick={handleDelete}>알림 지우기</Button>
        </ListItem>
      </List>
    ),
  }[checkOnOff(count, 0)]

  return (
    <>
      <IconButton onClick={() => setOpen(true)}>
        <Badge aria-controls="" badgeContent={count} color="primary" max={10}>
          <Notifications />
        </Badge>
      </IconButton>
      <Dialog open={open} onClose={() => setOpen(false)} title="알림창">
        {components}
      </Dialog>
    </>
  )
}
