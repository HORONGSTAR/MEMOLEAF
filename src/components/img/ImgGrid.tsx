import { Image } from '@/lib/types'
import { imgPath } from '@/lib/utills'
import { ImgModal } from '@/components'
import { Grid2 } from '@mui/material'

type Size = { [key: number]: number[] }
type Slice = { [key: number]: number }

export default function ImageGrid({ images }: { images: Image[] }) {
  const count = images.length
  if (count === 0) return null
  const imgUrls = images.map((img) => ({ id: img.id, url: imgPath + img.url }))

  const size: Size = { 1: [8, 0], 2: [6, 6], 3: [8, 4], 4: [6, 6] }
  const slice: Slice = { 1: 1, 2: 1, 3: 1, 4: 2 }

  return (
    <Grid2 container spacing={0.4} mt={2}>
      <Grid2 container spacing={0.4} size={size[count][0]}>
        {imgUrls.slice(0, slice[count]).map((img) => (
          <Grid2 key={img.id} position="relative">
            <ImgModal imgUrl={img.url} label={img.id + 'img'} />
          </Grid2>
        ))}
      </Grid2>
      <Grid2 container spacing={0.4} size={size[count][1]}>
        {imgUrls.slice(slice[count]).map((img) => (
          <Grid2 key={img.id} position="relative">
            <ImgModal imgUrl={img.url} label={img.id + 'img'} />
          </Grid2>
        ))}
      </Grid2>
    </Grid2>
  )
}
