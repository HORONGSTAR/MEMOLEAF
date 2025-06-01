'use client'
import { AddPhotoAlternate } from '@mui/icons-material'
import { Button, Stack, Box, Avatar } from '@mui/material'
import { Dispatch, SetStateAction, useCallback } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { openAlert } from '@/store/slices/alertSlice'

interface Props {
  image: { new: boolean; url: string }
  setImage: Dispatch<SetStateAction<{ new: boolean; url: string }>>
  isCover?: boolean
}

export default function ImgUploader(props: Props) {
  const { image, setImage, isCover } = props
  const dispatch = useAppDispatch()

  const handleImageChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files && e.target.files[0]
      const maxSize = 5 * 1024 * 1024
      if (!file) return
      if (file.size > maxSize) {
        dispatch(
          openAlert({
            message: '파일 크기는 5MB 이하로 업로드해주세요.',
            severity: 'info',
          })
        )
        e.target.value = ''
        return
      }
      const newImgUrls = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = () => reject(reader.error)
        reader.readAsDataURL(file)
      })

      setImage({ new: true, url: newImgUrls })
    },
    [dispatch, setImage]
  )

  const width = isCover ? '100%' : 120
  const height = isCover ? 140 : 120
  const borderRadius = isCover ? 2 : 60

  return (
    <Stack>
      <Button
        component="label"
        sx={{
          width,
          justifyContent: 'center',
          overflow: 'hidden',
          background: '#666',
          p: 0,
          borderRadius,
        }}
        variant="contained"
      >
        <Stack
          sx={{
            position: 'absolute',
            zIndex: 1,
            borderRadius: 5,
            background: 'rgba(0,0,0,0.40)',
            p: 1,
          }}
        >
          <AddPhotoAlternate />
        </Stack>
        <Avatar sx={{ width, height }} variant={isCover ? 'rounded' : 'circular'} src={image.url} alt="새로운 프로필 사진" />
        <Box display="none">
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </Box>
      </Button>
    </Stack>
  )
}
