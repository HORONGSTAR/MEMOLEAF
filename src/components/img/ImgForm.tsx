'use client'
import { IconButton, Snackbar, Tooltip } from '@mui/material'
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
  const [message, setMessage] = useState('')

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true)
    const files = e.target.files
    if (!files) return
    if (images.imgs.length + files.length > 4) {
      setMessage('이미지는 최대 4장까지 첨부할 수 있어요.')
      setLoading(false)
      return
    }

    const newImgUrls: string[] = []
    for (const i in files) {
      newImgUrls.push(URL.createObjectURL(files[i]))
    }

    setImages((prev) => ({
      file: [...prev.file, ...files],
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
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={message ? true : false}
        autoHideDuration={6000}
        onClose={() => setMessage('')}
        message={message}
      />
    </>
  )
}
