'use client'
import { ListItem, ListItemAvatar, ListItemText, Stack, Avatar, Typography } from '@mui/material'
import LinkBox from '@/components/common/LinkBox'
import { ProfileData } from '@/shared/types/client'
import { imgPath } from '@/shared/utils/common'

export default function UserList(user: ProfileData) {
  return (
    <>
      <ListItem disableGutters key={'followList' + user.id} alignItems="flex-start" divider>
        <ListItemAvatar>
          <LinkBox link={`/page/profile/${user.id}`}>
            <Avatar src={imgPath + user.image} alt={user.name} />
          </LinkBox>
        </ListItemAvatar>
        <ListItemText
          primary={
            <Stack direction="row" spacing={1}>
              <LinkBox link={`/page/profile/${user.id}`}>{user.name}</LinkBox>
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
