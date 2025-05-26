'use client'
import { Dispatch, SetStateAction, useRef, useState } from 'react'
import { IconButton, Snackbar, Tooltip } from '@mui/material'
import { ImageSearch } from '@mui/icons-material'
import { ImageData } from '@/shared/types/client'

interface Props {
  imgs: ImageData[]
  setImgs: Dispatch<SetStateAction<ImageData[]>>
  setFiles: Dispatch<SetStateAction<File[]>>
}

export default function ImgForm({ imgs, setImgs, setFiles }: Props) {
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [message, setMessage] = useState('')

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true)
    const files = e.target.files
    if (!files) {
      setLoading(false)
      return
    }

    if (imgs.length + files.length > 4) {
      setMessage('이미지는 최대 4장까지 첨부할 수 있어요.')
      setLoading(false)
      return
    }

    try {
      const fileArray = Array.from(files)
      const readFilePromises = fileArray.map((file) => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = () => reject(reader.error)
          reader.readAsDataURL(file)
        })
      })

      const newImgUrls = await Promise.all(readFilePromises)

      setFiles((prev) => [...prev, ...fileArray])
      setImgs((prev) => [...prev, ...newImgUrls.map((url) => ({ url, alt: '' }))])
    } catch (error) {
      console.error('파일 읽기 중 오류 발생:', error)
      setMessage('파일을 읽는 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Tooltip title="이미지 업로드">
        <IconButton
          color="primary"
          loading={loading}
          size="small"
          aria-label="이미지 업로드"
          disabled={imgs.length > 3}
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
