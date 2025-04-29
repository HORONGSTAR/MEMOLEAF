import { Image } from '@/lib/types'
import { imgPath } from '@/lib/utills'

interface Images {
  images: Image[]
}
export default function ImageGrid({ images }: Images) {
  if (!images) return
  const count = images.length
  const imgUrls = images.map((img) => ({
    id: img.id,
    url: imgPath + img.url,
  }))
  if (count === 1) {
    return (
      <div className="w-full ">
        <img src={imgUrls[0].url} alt="" className="w-auto" />
      </div>
    )
  }

  if (count === 2) {
    return (
      <div className="grid grid-cols-2 gap-1">
        {imgUrls.map((img) => (
          <img key={img.id} src={img.url} alt="" className="w-full aspect-square object-cover" />
        ))}
      </div>
    )
  }

  if (count === 3) {
    return (
      <div className="grid grid-cols-3 gap-1 h-72">
        <div className="col-span-2">
          <img src={imgUrls[0].url} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col gap-1">
          <img src={imgUrls[1].url} alt="" className="w-full h-1/2 object-cover" />
          <img src={imgUrls[2].url} alt="" className="w-full h-1/2 object-cover" />
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-1">
      {imgUrls.slice(0, 4).map((img) => (
        <img key={img.id} src={img.url} alt="" className="w-full aspect-square object-cover" />
      ))}
    </div>
  )
}
