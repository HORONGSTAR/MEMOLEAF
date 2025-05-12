import { Image } from '@/lib/types'
import { ImgModal } from '@/components'
import { Box, ImageList, ImageListItem } from '@mui/material'
import { ReactNode } from 'react'

interface Images extends Image {
  remove?: ReactNode
}

interface Props {
  images: Images[]
  cols?: number
}

export default function ImageGrid({ images, cols }: Props) {
  const count = images.length
  if (count === 0) return null

  return (
    <ImageList cols={cols || 4} sx={{ mt: 2 }}>
      {images.map((img) => (
        <ImageListItem key={img.url}>
          <Box position="relative">
            {img.remove}
            <ImgModal image={img.url} label={img.id + 'img'} />
          </Box>
        </ImageListItem>
      ))}
    </ImageList>
  )
}
