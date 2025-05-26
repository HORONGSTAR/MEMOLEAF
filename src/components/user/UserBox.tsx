'use client'
import { ListItem, ListItemAvatar, ListItemText, Stack, Typography } from '@mui/material'
import { Avatar, LinkBox } from '@/components/common'
import { ProfileData } from '@/shared/types/client'

export default function UserList(user: ProfileData) {
  return (
    <>
      <ListItem disableGutters key={'followList' + user.id} alignItems="flex-start" divider>
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
    </>
  )
}
