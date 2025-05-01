'use client'
import { IconButton, CircularProgress } from '@mui/material'
import imageCompression from 'browser-image-compression'
import { useRef, Dispatch, SetStateAction, useState } from 'react'
import { ImgModal } from '@/components'
import { ImageSearch } from '@mui/icons-material'
import { imgPath } from '@/lib/utills'
import { Image } from '@/lib/types'

interface Props {
  images: Image[]
  setImages: Dispatch<SetStateAction<Image[]>>
  setImgFiles: Dispatch<SetStateAction<File[]>>
  setRmImgs: Dispatch<
    SetStateAction<{
      id: number[]
      url: string[]
    }>
  >
}

export default function ImgForm(props: Props) {
  const [loading, setLoading] = useState(false)
  const { images, setImages, setImgFiles, setRmImgs } = props
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true)
    const files = e.target.files
    if (!files) return
    if (files.length > 4) return alert('이미지는 최대 4장까지 첨부할 수 있어요.')

    const newImgFiles: File[] = []
    const newImgUrls: string[] = []

    for (let i = 0; i < files.length; i++) {
      const file = await imageCompression(files[i], {
        maxSizeMB: 1,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
      })
      newImgFiles.push(file)
      newImgUrls.push(URL.createObjectURL(file))
    }
    setImgFiles((prev) => [...prev, ...newImgFiles])
    setImages((prev) => [...prev, ...newImgUrls.map((img) => ({ id: 0, url: img }))])
    setLoading(false)
  }

  const removeFile = (index: number, img: Image) => {
    setImgFiles((prev) => prev.filter((_, i) => i !== index))
    setImages((prev) => prev.filter((_, i) => i !== index))
    if (img.id > 0) setRmImgs((prev) => ({ id: [...prev.id, img.id], url: [...prev.url, img.url] }))
  }

  return (
    <div>
      {loading ? (
        <CircularProgress size={36} />
      ) : (
        <IconButton disabled={images.length > 3} onClick={() => fileInputRef.current?.click()}>
          <ImageSearch />
        </IconButton>
      )}
      <input
        className="hidden"
        ref={fileInputRef}
        id="image"
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => handleFileChange(e)}
      />
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
    </div>
  )
}
