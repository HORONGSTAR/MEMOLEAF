import { AddPhotoAlternate } from '@mui/icons-material'
import { Button, Stack, Box, Avatar } from '@mui/material'
import { Dispatch, SetStateAction, useCallback } from 'react'

interface Props {
  image: { file?: File; url: string }
  setImage: Dispatch<SetStateAction<{ file?: File; url: string }>>
}

export default function ImgUploader(props: Props) {
  const { image, setImage } = props

  const handleImageChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files && e.target.files[0]
      if (!file) return
      const newImgUrls = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = () => reject(reader.error)
        reader.readAsDataURL(file)
      })

      setImage({ file: file, url: newImgUrls })
    },
    [setImage]
  )

  return (
    <Stack>
      <Button
        component="label"
        sx={{
          width: 120,
          justifyContent: 'center',
          overflow: 'hidden',
          background: '#666',
          p: 0,
          borderRadius: 60,
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
        <Avatar sx={{ width: 120, height: 120 }} src={image.url} alt="새로운 프로필 사진" />
        <Box display="none">
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </Box>
      </Button>
    </Stack>
  )
}
