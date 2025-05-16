'use client'
import { IconButton, Tooltip } from '@mui/material'
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
    if (images.imgs.length + files.length > 4) {
      alert('이미지는 최대 4장까지 첨부할 수 있어요.')
      setLoading(false)
      return
    }

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
      imgs: [...prev.imgs, ...newImgUrls.map((img) => ({ url: img, alt: '' }))],
    }))
    setLoading(false)
  }

  return (
    <>
      <Tooltip title="이미지 업로드">
        <IconButton
          color="primary"
          loading={loading}
          size="small"
          aria-label="이미지 업로드"
          disabled={images.imgs.length > 3}
          onClick={() => fileInputRef.current?.click()}
        >
          <ImageSearch />
        </IconButton>
      </Tooltip>
      <input className="hidden" ref={fileInputRef} id="image" type="file" accept="image/*" multiple onChange={(e) => handleFileChange(e)} />
    </>
  )
}
