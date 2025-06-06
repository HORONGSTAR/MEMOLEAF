'use client'
import { Typography, List, ListItem, Stack, IconButton, TextField, Button, Avatar } from '@mui/material'
import { checkOnOff, imgPath, swapOnOff } from '@/shared/utils/common'
import { useState, useCallback, useMemo } from 'react'
import { DriveFileRenameOutline } from '@mui/icons-material'
import { updateProfileThunk } from '@/store/slices/profileSlice'
import { useAppDispatch } from '@/store/hooks'
import { useSession } from 'next-auth/react'
import { UserParams } from '@/shared/types/api'
import { ProfileData } from '@/shared/types/client'
import ImageUploader from '@/components/user/ImageUploader'
import FollowButton from '@/components/user/FollowButton'
import { openAlert } from '@/store/slices/alertSlice'

export default function MyProfile(inti: ProfileData) {
  const [profile, setProfile] = useState(inti)
  const [image, setImage] = useState<{ new: boolean; url: string }>({ new: false, url: imgPath + inti.image })
  const [name, setName] = useState(profile.name)
  const [info, setInfo] = useState(profile.info || '')
  const [edit, setEdit] = useState('off')
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

  const handleSubmit = useCallback(() => {
    setEdit('off')
    const userData: UserParams = { name, info }
    if (image.new) {
      userData.image = image.url
      setImage({ new: false, url: '' })
    }
    dispatch(openAlert({ message: '프로필 수정 중...', severity: 'info' }))
    dispatch(updateProfileThunk(userData))
      .unwrap()
      .then((result) => {
        setProfile((prev) => ({ ...prev, ...result }))
        dispatch(openAlert({ message: '프로필을 수정했습니다.' }))
      })
      .catch((error) => {
        console.error(error)
        dispatch(openAlert({ message: '프로필 업로드 중 문제가 발생했습니다.', severity: 'error' }))
      })
  }, [name, info, image, dispatch])

  const followAction = useMemo(() => {
    if (swapOnOff[isMine].bool) return 'none'
    return profile.followings?.some((user) => user.followerId === myId) ? 'follow' : 'unfollow'
  }, [isMine, myId, profile.followings])

  const myButton = {
    on: (
      <IconButton size="small" aria-label="프로필 수정하기" onClick={() => setEdit('on')}>
        <DriveFileRenameOutline fontSize="small" />
      </IconButton>
    ),
    off: myId && <FollowButton followingName={profile.name} followingId={profile.id} state={followAction} />,
  }[isMine]

  const profileBox = (
    <Stack direction={{ sm: 'row', xs: 'column' }}>
      <Avatar src={imgPath + profile.image} alt={profile.name} sx={{ width: 120, height: 120 }} />

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
  )

  const editBox = (
    <Stack direction={{ sm: 'row', xs: 'column' }} spacing={2}>
      <ImageUploader image={image} setImage={setImage} />
      <Stack width="100%" spacing={2}>
        <TextField
          fullWidth
          label="이름"
          size="small"
          placeholder="최대 글자수 10자"
          value={name}
          onChange={(e) => handleChangeName(e.target.value)}
        />
        <TextField
          fullWidth
          label="자기소개"
          size="small"
          placeholder="최대 글자수 191자"
          multiline
          rows={2}
          value={info}
          onChange={(e) => handleChangeInfo(e.target.value)}
        />
        <Stack direction="row" justifyContent="end">
          <Button color="error" onClick={() => setEdit('off')}>
            취소
          </Button>
          <Button onClick={handleSubmit}>완료</Button>
        </Stack>
      </Stack>
    </Stack>
  )

  return { off: profileBox, on: editBox }[edit]
}
