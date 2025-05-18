'use client'
import { Typography, List, ListItem, Stack, IconButton, Box, TextField } from '@mui/material'
import { DriveFileRenameOutline } from '@mui/icons-material'
import { Avatar, Dialog, FollowButton, ImgUploader } from '@/components'
import { useState, useCallback, useMemo } from 'react'
import { UserData, UserParams } from '@/lib/types'
import { useSession } from 'next-auth/react'
import { checkCurrentOnOff, imgPath, setRenameFile, swapOnOff } from '@/lib/utills'
import { useAppDispatch } from '@/store/hooks'
import { updateProfileThunk } from '@/store/slices/profileSlice'

export default function MyProfile(inti: UserData) {
  const [profile, setProfile] = useState(inti)
  const [image, setImage] = useState<{ file?: File; url: string }>({ url: imgPath + inti.image })
  const [name, setName] = useState(profile.name)
  const [info, setInfo] = useState(profile.info || '')
  const [open, setOpen] = useState(false)
  const { data: session } = useSession()
  const dispatch = useAppDispatch()

  const myId = session?.user.id
  const isMine = checkCurrentOnOff(profile.id, myId || 0)

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
      const renamedFile = setRenameFile(image.file)
      setImage({ file: undefined, url: '' })
      userData.file = renamedFile
      userData.image = renamedFile.name
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
    return profile.toUsers?.some((user) => user.id !== myId) ? 'follow' : 'unfollow'
  }, [isMine, myId, profile.toUsers])

  const myButton = {
    on: (
      <IconButton size="small" aria-label="프로필 수정하기" onClick={() => setOpen(true)}>
        <DriveFileRenameOutline fontSize="small" />
      </IconButton>
    ),
    off: myId && <FollowButton fromUserId={myId} toUserId={profile.id} action={followAction} />,
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
      <Box sx={{ width: '100%' }}></Box>

      <Dialog {...dialogProps}>
        <Stack spacing={3} mt={2}>
          <ImgUploader image={image} setImage={setImage} />
          <TextField label="이름" size="small" value={name} onChange={(e) => handleChangeName(e.target.value)} />
          <TextField label="자기소개" size="small" multiline rows={3} value={info} onChange={(e) => handleChangeInfo(e.target.value)} />
        </Stack>
      </Dialog>
    </Stack>
  )
}
