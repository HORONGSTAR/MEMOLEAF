'use client'
import { Typography, List, ListItem, Stack, IconButton, TextField } from '@mui/material'
import { checkOnOff, imgPath, swapOnOff } from '@/shared/utils/common'
import { useState, useCallback, useMemo } from 'react'
import { Avatar, Dialog, TextCount } from '@/components/common'
import { DriveFileRenameOutline } from '@mui/icons-material'
import { updateProfileThunk } from '@/store/slices/profileSlice'
import { useAppDispatch } from '@/store/hooks'
import { useSession } from 'next-auth/react'
import { UserParams } from '@/shared/types/api'
import { ProfileData } from '@/shared/types/client'
import AvatarUploader from '@/components/user/AvatarUploader'
import FollowButton from '@/components/user/FollowButton'

export default function MyProfile(inti: ProfileData) {
  const [profile, setProfile] = useState(inti)
  const [image, setImage] = useState<{ file?: File; url: string }>({ url: imgPath + inti.image })
  const [name, setName] = useState(profile.name)
  const [info, setInfo] = useState(profile.info || '')
  const [open, setOpen] = useState(false)
  const { data: session } = useSession()
  const dispatch = useAppDispatch()

  const myId = session?.user.id
  const isMine = checkOnOff(profile.id, myId || 0)

  const handleChangeName = useCallback((value: string) => {
    if (value.length > 12) return
    setName(value)
  }, [])

  const handleChangeInfo = useCallback((value: string) => {
    if (value.length > 191) return
    setInfo(value)
  }, [])

  const handleSubmit = useCallback(async () => {
    setOpen(false)
    const userData: UserParams = {
      name: name,
      info: info,
    }
    if (image.file) {
      userData.file = image.file
      setImage({ file: undefined, url: '' })
    }
    dispatch(updateProfileThunk(userData))

    setProfile((prev) => ({ ...prev, ...userData }))
  }, [name, info, image.file, dispatch])

  const dialogProps = {
    open,
    title: '프로필 수정하기',
    closeLabel: '확인',
    onClose: handleSubmit,
  }

  const followAction = useMemo(() => {
    if (swapOnOff[isMine].bool) return 'none'
    return profile.toUsers?.some((user) => user.fromUserId === myId) ? 'follow' : 'unfollow'
  }, [isMine, myId, profile.toUsers])

  const myButton = {
    on: (
      <IconButton size="small" aria-label="프로필 수정하기" onClick={() => setOpen(true)}>
        <DriveFileRenameOutline fontSize="small" />
      </IconButton>
    ),
    off: myId && <FollowButton toUserName={profile.name} toUserId={profile.id} state={followAction} />,
  }[isMine]

  return (
    <Stack spacing={2}>
      <Stack direction={{ sm: 'row', xs: 'column' }}>
        <Avatar size={120} user={profile} />
        <List dense sx={{ flexGrow: 1 }}>
          <ListItem>
            <Typography variant="h6">{profile.name}</Typography>
            {myButton}
          </ListItem>
          <ListItem>
            <Typography variant="body2" color="textSecondary">
              ID {profile.userNum}
            </Typography>
          </ListItem>
          <ListItem>{profile.info || '자기소개가 없습니다.'}</ListItem>
        </List>
      </Stack>

      <Dialog {...dialogProps}>
        <Stack spacing={2} mt={2}>
          <AvatarUploader image={image} setImage={setImage} />
          <Stack spacing={1}>
            <TextField label="이름" size="small" placeholder="최대 글자수 10자" value={name} onChange={(e) => handleChangeName(e.target.value)} />
            <TextCount text={name} max={10} />
            <TextField
              label="자기소개"
              size="small"
              placeholder="최대 글자수 191자"
              multiline
              rows={3}
              value={info}
              onChange={(e) => handleChangeInfo(e.target.value)}
            />
            <TextCount text={info} max={191} />
          </Stack>
        </Stack>
      </Dialog>
    </Stack>
  )
}
