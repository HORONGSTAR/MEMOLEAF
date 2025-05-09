import { Image } from '@/lib/types'
import { ImgModal } from '@/components'
import { Box, Grid } from '@mui/material'
import { ReactNode } from 'react'

interface Props extends Image {
  remove?: ReactNode
}

export default function ImageGrid({ images }: { images: Props[] }) {
  const count = images.length
  if (count === 0) return null

  return (
    <Grid container spacing={0.4} my={2}>
      {images.map((img) => (
        <Grid key={img.url} size={3}>
          {img.remove}
          <Box sx={{ position: 'relative', width: '100%', aspectRatio: '4 / 3' }}>
            <ImgModal image={img.url} label={img.id + 'img'} />
          </Box>
        </Grid>
      ))}
    </Grid>
  )
}
