'use client'
import { Avatar, Badge, Box, Button, IconButton, List, ListItem, ListItemAvatar, Stack, Typography } from '@mui/material'
import { CircleNotifications, Notifications } from '@mui/icons-material'
import { useCallback, useState } from 'react'
import { deleteAlarm } from '@/shared/fetch/alarmApi'
import { checkOnOff, imgPath } from '@/shared/utils/common'
import DialogBox from '@/components/common/DialogBox'
import LinkBox from '@/components/common/LinkBox'
import { AlarmData, AlarmJoinUser } from '@/shared/types/client'

export default function AlarmBox(props: AlarmData) {
  const [open, setOpen] = useState(false)
  const [alarms, setAlarms] = useState<AlarmJoinUser[]>(props.alarms || [])
  const [count, setCount] = useState(alarms.length || 0)

  const handleDelete = useCallback(() => {
    deleteAlarm()
    setAlarms([])
    setCount(0)
  }, [])

  const alarmLink = (alarm: AlarmJoinUser) =>
    ({
      comment: `/page/detail/${alarm.link}`,
      follow: `/page/profile/${alarm.link}`,
      bookmark: `/page/detail/${alarm.link}`,
      favorite: `/page/detail/${alarm.link}`,
    }[alarm.aria])

  const alarmComment = (alarm: AlarmJoinUser) =>
    ({
      comment: `${alarm.sander.name}님이 내 메모에 타래글을 달았습니다.`,
      follow: `${alarm.sander.name}님이 나를 팔로우했습니다.`,
      bookmark: `${alarm.sander.name}님이 내 메모를 북마크했습니다.`,
      favorite: `${alarm.sander.name}님이 내 메모를 좋아합니다.`,
    }[alarm.aria])

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
            <LinkBox link={`/page/profile/${alarm.sander.id}`}>
              <ListItemAvatar>
                <Avatar src={imgPath + alarm.sander.image} alt={alarm.sander.name} />
              </ListItemAvatar>
            </LinkBox>
            <LinkBox variant="body2" color="textPrimary" link={alarmLink(alarm)}>
              {alarmComment(alarm)}
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
      <DialogBox open={open} onClose={() => setOpen(false)} title="알림창">
        {components}
      </DialogBox>
    </>
  )
}
