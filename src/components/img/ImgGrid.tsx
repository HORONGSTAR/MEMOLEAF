import { Image } from '@/lib/types'
import { imgPath } from '@/lib/utills'
import { ImgModal } from '@/components'
import { Grid2, Paper } from '@mui/material'

export default function ImageGrid({ images }: { images: Image[] }) {
  const count = images.length
  if (count === 0) return null
  const imgUrls = images.map((img) => ({
    id: img.id,
    url: imgPath + img.url,
  }))
  return (
    <Grid2 container spacing={0.5} mt={2}>
      {imgUrls.map((img) => (
        <Grid2 key={img.id} size={{ md: 12 / count, sm: count % 2 === 1 ? 12 / count : 12 / 2 }} position="relative">
          <Paper variant="outlined">
            <ImgModal imgUrl={img.url} label={img.id + 'img'} />
          </Paper>
        </Grid2>
      ))}
    </Grid2>
  )
}
