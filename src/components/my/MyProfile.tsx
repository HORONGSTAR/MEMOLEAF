'use client'
import { Typography, List, ListItem, Stack, IconButton, Box, TextField, Button } from '@mui/material'
import { DriveFileRenameOutline } from '@mui/icons-material'
import { Avatar, Dialog, ImgUploader } from '@/components'
import { useState, useMemo, useCallback } from 'react'
import { User, UserParams } from '@/lib/types'
import { useSession } from 'next-auth/react'
import { imgPath, setRenameFile } from '@/lib/utills'
import { updateUser } from '@/lib/api/userApi'

export default function MyProfile(user: User) {
  const [profile, setProfile] = useState(user)
  const [image, setImage] = useState<{ file?: File; url: string }>({ url: imgPath + user.image })
  const [name, setName] = useState(user.name)
  const [info, setInfo] = useState(user.info || '')
  const [open, setOpen] = useState(false)
  const { data: session } = useSession()
  const auth = session?.user

  const isMyPage = useMemo(() => auth && auth.id === user.id, [auth, user])

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
      id: user.id,
      name: name,
      info: info,
    }
    if (image.file) {
      const renamedFile = setRenameFile(image.file)
      setImage({ file: undefined, url: '' })
      userData.file = renamedFile
      userData.image = renamedFile.name
    }
    await updateUser(userData)
    setProfile((prev) => ({ ...prev, ...userData }))
  }, [user, name, info, image])

  return (
    <Stack spacing={2}>
      <Stack direction={{ sm: 'row', xs: 'column' }}>
        <Avatar size={120} user={profile} />
        <List dense sx={{ flexGrow: 1 }}>
          <ListItem>
            <Typography variant="h6">{profile.name}</Typography>
            {isMyPage && (
              <IconButton size="small" onClick={() => setOpen(true)}>
                <DriveFileRenameOutline fontSize="small" />
              </IconButton>
            )}
          </ListItem>
          <ListItem>
            <Typography variant="body2" color="textSecondary">
              ID {user.userNum}
            </Typography>
          </ListItem>
          <ListItem>{profile.info || '자기소개가 없습니다.'}</ListItem>
        </List>
      </Stack>
      <Box sx={{ width: '100%' }}></Box>
      <Dialog label="프로필 수정하기" open={open} actions={<Button onClick={handleSubmit}>확인</Button>}>
        <Stack spacing={3} mt={2}>
          <ImgUploader image={image} setImage={setImage} />
          <TextField label="이름" size="small" value={name} onChange={(e) => handleChangeName(e.target.value)} />
          <TextField label="자기소개" size="small" multiline rows={3} value={info} onChange={(e) => handleChangeInfo(e.target.value)} />
        </Stack>
      </Dialog>
    </Stack>
  )
}
