import { Image } from '@/lib/types'
import { ImgModal } from '@/components'
import { Box, ImageList, ImageListItem } from '@mui/material'
import { ReactNode } from 'react'

interface Props extends Image {
  remove?: ReactNode
}

export default function ImageGrid({ images }: { images: Props[] }) {
  const count = images.length
  if (count === 0) return null

  return (
    <ImageList cols={4}>
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
