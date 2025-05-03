'use client'
import { ImgModal } from '@/components'
import { imgPath } from '@/lib/utills'
import { ImageState, Image } from '@/lib/types'

export default function ImgForm(props: ImageState) {
  const { images, setImages, setImgFiles, setRmImgs } = props

  const removeFile = (index: number, img: Image) => {
    setImgFiles((prev) => prev.filter((_, i) => i !== index))
    setImages((prev) => prev.filter((_, i) => i !== index))
    if (img.id > 0) setRmImgs((prev) => ({ id: [...prev.id, img.id], url: [...prev.url, img.url] }))
  }

  return (
    <div className="flex gap-2 mt-2 flex-wrap">
      {images.map((img, index) => (
        <div key={index} className="relative w-24 h-24">
          <ImgModal imgUrl={img.id > 0 ? imgPath + img.url : img.url} label={`image${index}`} />
          <button
            type="button"
            onClick={() => removeFile(index, img)}
            className="absolute top-[-4px] right-[-4px] bg-black text-white text-xs size-6 rounded-full"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  )
}
