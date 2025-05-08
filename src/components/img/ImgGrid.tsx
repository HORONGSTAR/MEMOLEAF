import { Image } from '@/lib/types'
import { ImgModal } from '@/components'
import { Grid } from '@mui/material'
import { ReactNode } from 'react'

type Size = { [key: number]: number[] }
type Slice = { [key: number]: number }
type Aaspect = { [key: number]: string }

interface Props extends Image {
  remove?: ReactNode
}

export default function ImageGrid({ images }: { images: Props[] }) {
  const count = images.length
  if (count === 0) return null

  const size: Size = { 1: [12, 0], 2: [6, 6], 3: [8, 4], 4: [6, 6] }
  const slice: Slice = { 1: 1, 2: 1, 3: 1, 4: 2 }
  const aspect: Aaspect = { 1: 'video', 2: 'square', 3: 'square', 4: 'video' }

  return (
    <Grid container spacing={0.4} my={2}>
      <Grid container spacing={0.4} size={size[count][0]}>
        {images.slice(0, slice[count]).map((img, index) => (
          <Grid key={`${img.id}-left-${index}`} position="relative">
            {img.remove}
            <ImgModal image={img.url} label={img.id + 'img'} aspect={aspect[count]} />
          </Grid>
        ))}
      </Grid>
      <Grid container spacing={0.4} size={size[count][1]}>
        {images.slice(slice[count]).map((img, index) => (
          <Grid key={`${img.id}-right-${index}`} position="relative">
            {img.remove}
            <ImgModal image={img.url} label={img.id + 'img'} aspect={aspect[count]} />
          </Grid>
        ))}
      </Grid>
    </Grid>
  )
}
