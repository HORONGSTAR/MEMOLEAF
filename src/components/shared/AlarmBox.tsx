'use client'
import { Badge, Box, Button, IconButton, List, ListItem, ListItemAvatar, Stack, Typography } from '@mui/material'
import { CircleNotifications, Notifications } from '@mui/icons-material'
import { useCallback, useState } from 'react'
import { deleteAlarm } from '@/shared/fetch/alarmApi'
import { checkOnOff } from '@/shared/utils/common'
import { UserData } from '@/shared/types/client'
import Dialog from '@/components/common/Dialog'
import Avatar from '@/components/common/Avatar'
import LinkBox from '@/components/common/LinkBox'

interface AlarmData {
  id: number
  aria: 'comment' | 'follow' | 'bookmark'
  linkId: number
  reader: UserData
}

interface Props {
  alarms?: AlarmData[]
  count?: number
}

export default function AlarmBox(props: Props) {
  const [open, setOpen] = useState(false)
  const [alarms, setAlarms] = useState<AlarmData[]>(props.alarms || [])
  const [count, setCount] = useState(props.count || 0)

  const handleDelete = useCallback(() => {
    deleteAlarm()
    setAlarms([])
    setCount(0)
  }, [])

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
            <LinkBox link={`/page/profile/${alarm.reader.id}`}>
              <ListItemAvatar>
                <Avatar user={alarm.reader} size={40} />
              </ListItemAvatar>
            </LinkBox>
            <LinkBox
              variant="body2"
              color="textPrimary"
              link={
                { comment: `/page/detail/${alarm.linkId}`, follow: `/page/profile/${alarm.linkId}`, bookmark: `/page/detail/${alarm.linkId}` }[
                  alarm.aria
                ]
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
