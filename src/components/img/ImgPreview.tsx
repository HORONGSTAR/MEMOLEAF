'use client'
import { ImgModal } from '@/components'
import { imgPath } from '@/lib/utills'
import { ImageState, Image } from '@/lib/types'

export default function ImgForm(props: ImageState) {
  const { imgList, setImgList, setImgFiles } = props

  const removeFile = (index: number, img: Image) => {
    const create = imgList.create.filter((_, i) => i !== index)
    const remove = img.id ? [...imgList.remove, img] : imgList.remove

    setImgFiles((prev) => prev.filter((_, i) => i !== index))
    setImgList({ create, remove })
  }

  return (
    <div className="flex gap-2 mt-2 flex-wrap">
      {imgList.create.map((img, index) => (
        <div key={index} className="relative w-24 h-24">
          <ImgModal image={img.id ? imgPath + img.url : img.url} label={`image${index}`} />
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
