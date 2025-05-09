'use client'
import { IconButton, CircularProgress } from '@mui/material'
import imageCompression from 'browser-image-compression'
import { Dispatch, SetStateAction, useRef, useState } from 'react'
import { ImageSearch } from '@mui/icons-material'
import { EditImage } from '@/lib/types'

interface Props {
  images: EditImage
  setImages: Dispatch<SetStateAction<EditImage>>
}

export default function ImgForm(props: Props) {
  const [loading, setLoading] = useState(false)
  const { images, setImages } = props
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
    setImages((prev) => ({
      file: [...prev.file, ...newImgFiles],
      add: [...prev.add, ...newImgUrls.map((img) => ({ url: img, alt: '' }))],
      del: prev.del,
    }))
    setLoading(false)
  }

  return (
    <>
      {loading ? (
        <CircularProgress size={36} />
      ) : (
        <IconButton size="small" aria-label="이미지 업로드" disabled={images.add.length > 3} onClick={() => fileInputRef.current?.click()}>
          <ImageSearch />
        </IconButton>
      )}
      <input className="hidden" ref={fileInputRef} id="image" type="file" accept="image/*" multiple onChange={(e) => handleFileChange(e)} />
    </>
  )
}
