'use client'
import { IconButton, CircularProgress } from '@mui/material'
import imageCompression from 'browser-image-compression'
import { useRef, useState } from 'react'
import { ImageSearch } from '@mui/icons-material'
import { ImageState } from '@/lib/types'

export default function ImgForm(props: ImageState) {
  const [loading, setLoading] = useState(false)
  const { imgList, setImgList, setImgFiles } = props
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
    setImgList((prev) => ({
      create: [...prev.create, ...newImgUrls.map((img) => ({ url: img, alt: '' }))],
      remove: prev.remove,
    }))
    setLoading(false)
  }

  return (
    <>
      {loading ? (
        <CircularProgress size={36} />
      ) : (
        <IconButton
          aria-label="이미지 업로드"
          disabled={imgList.create.length > 3}
          onClick={() => fileInputRef.current?.click()}
        >
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
    </>
  )
}
