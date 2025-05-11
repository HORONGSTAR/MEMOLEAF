'use client'
import { Typography, List, ListItem, Divider, Stack, IconButton, Tab, Tabs, Box, TextField, Button } from '@mui/material'
import { DriveFileRenameOutline } from '@mui/icons-material'
import { Avatar, ImgGrid, LinkBox, MemoBox, MemoDeco, Dialog, ImgUploader } from '@/components'
import { useState, useMemo, useCallback } from 'react'
import { User, Memo, UserParams } from '@/lib/types'
import { signIn, signOut, useSession } from 'next-auth/react'
import { editImageUrl, imgPath, setRenameFile } from '@/lib/utills'
import { updateUser } from '@/lib/api/userApi'

interface Props {
  user: User
  myMemos: {
    currentPage: number
    memos: Memo[]
    totalPages: number
  }
}

export default function Profile(props: Props) {
  const { user, myMemos } = props
  const [image, setImage] = useState<{ file?: File; url: string }>({ url: imgPath + user.image })
  const [value, setValue] = useState(0)
  const [name, setName] = useState(user.name)
  const [info, setInfo] = useState(user.info || '')
  const [edit, setEdit] = useState(false)
  const { data: session } = useSession()
  const auth = session?.user
  const profile = props.user

  const isMyPage = useMemo(() => auth && auth.id === user.id, [auth, user])

  const handleSubmit = useCallback(async () => {
    setEdit(false)
    const userData: UserParams = {
      id: user.id,
      name: name,
      info: info,
    }
    if (image.file) {
      const renamedFile = setRenameFile(image.file)
      setImage({ file: renamedFile, url: renamedFile.name })
      userData.file = renamedFile
      userData.image = renamedFile.name
    }

    await updateUser(userData)
  }, [user, name, info, image])

  return (
    <Stack spacing={2}>
      <Stack direction={{ sm: 'row', xs: 'column' }}>
        <Avatar size={120} user={profile} />
        <List dense sx={{ flexGrow: 1 }}>
          <ListItem>
            <Typography variant="h6">{profile.name}</Typography>
            {isMyPage && (
              <IconButton size="small" onClick={() => setEdit(true)}>
                <DriveFileRenameOutline fontSize="small" />
              </IconButton>
            )}
          </ListItem>
          <ListItem>
            <Typography variant="body2" color="textSecondary">
              ID {profile.userNum}
            </Typography>
          </ListItem>
          <ListItem>{profile.info || '자기소개가 없습니다.'}</ListItem>
        </List>
      </Stack>
      <Box sx={{ width: '100%' }}>
        <Box>
          <Tabs value={value} onChange={(_, newValue) => setValue(newValue)} aria-label="게시글 목록">
            <Tab label="내 메모" id="tab-0" aria-controls="panel-0" />
          </Tabs>
        </Box>
        <Divider />
        <Stack spacing={2} my={2} role="panel-0" hidden={value !== 0} id="panel-0" aria-labelledby="tab-0">
          {myMemos.memos.map((memo) => (
            <MemoBox key={memo.id} {...memo} activeUserInfo="off">
              <LinkBox link={`/page/memo/${memo.id}`}>
                <MemoDeco decos={memo.decos}>
                  {memo.content}
                  <ImgGrid images={editImageUrl(memo.images)} />
                </MemoDeco>
              </LinkBox>
            </MemoBox>
          ))}
        </Stack>
      </Box>
      <Dialog label="프로필 수정하기" open={edit}>
        <Stack spacing={3} mt={2}>
          <ImgUploader image={image} setImage={setImage} />
          <TextField label="이름" size="small" value={name} onChange={(e) => setName(e.target.value)} />
          <TextField label="자기소개" size="small" multiline rows={3} value={info} onChange={(e) => setInfo(e.target.value)} />
          <Button onClick={handleSubmit}>확인</Button>
        </Stack>
      </Dialog>
    </Stack>
  )
}
