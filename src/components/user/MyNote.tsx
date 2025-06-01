'use client'
import { List, ListItem, Stack, TextField, Button, Avatar } from '@mui/material'
import { checkOnOff, imgPath } from '@/shared/utils/common'
import { useState, useCallback } from 'react'
import { EditNote } from '@mui/icons-material'
import { updateProfileThunk } from '@/store/slices/profileSlice'
import { useAppDispatch } from '@/store/hooks'
import { useSession } from 'next-auth/react'
import { UserParams } from '@/shared/types/api'
import { ProfileData } from '@/shared/types/client'
import ImageUploader from '@/components/user/ImageUploader'

export default function MyNote(inti: ProfileData) {
  const [profile, setProfile] = useState(inti)
  const [cover, setCover] = useState<{ new: boolean; url: string }>({ new: false, url: imgPath + inti.cover })
  const [note, setNote] = useState(profile.note || '')
  const [edit, setEdit] = useState('off')
  const { data: session } = useSession()
  const dispatch = useAppDispatch()

  const myId = session?.user.id
  const isMine = checkOnOff(profile.id, myId || 0)

  const handleChangeNote = useCallback((value: string) => {
    if (value.length === 0) return
    setNote(value)
  }, [])

  const handleSubmit = useCallback(async () => {
    setEdit('off')
    const userData: UserParams = { note }
    if (cover.new) {
      userData.cover = cover.url
      setCover({ new: false, url: '' })
    }
    dispatch(updateProfileThunk(userData))
      .unwrap()
      .then((result) => setProfile((prev) => ({ ...prev, ...result })))
  }, [note, cover, dispatch])

  const myButton = (
    <Button startIcon={<EditNote />} onClick={() => setEdit('on')}>
      노트 수정하기
    </Button>
  )

  const NoteBox = (
    <Stack my={2}>
      <Avatar src={imgPath + profile.cover} alt={`${profile.name}님의 노트 커버`} sx={{ width: '100%', height: 140 }} variant="rounded" />
      <List dense sx={{ flexGrow: 1 }}>
        <ListItem sx={{ minHeight: 100, whiteSpace: 'pre-line' }}>{profile.note || '노트가 비어 있습니다.'}</ListItem>
        <Stack direction="row" justifyContent="end">
          {{ on: myButton, off: null }[isMine]}
        </Stack>
      </List>
    </Stack>
  )

  const editBox = (
    <Stack spacing={2} my={2}>
      <ImageUploader image={cover} setImage={setCover} isCover />
      <Stack width="100%" spacing={2}>
        <TextField
          fullWidth
          label="노트"
          placeholder="자주 확인해야할 내용을 따로 기록할 수 있어요."
          size="small"
          multiline
          rows={3}
          value={note}
          onChange={(e) => handleChangeNote(e.target.value)}
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

  return { off: NoteBox, on: editBox }[edit]
}
