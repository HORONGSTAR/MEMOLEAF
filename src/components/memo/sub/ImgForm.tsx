'use client'
import { Dispatch, SetStateAction, useCallback, useRef, useState } from 'react'
import { IconButton, Tooltip } from '@mui/material'
import { ImageSearch } from '@mui/icons-material'
import { UploadData } from '@/shared/types/client'
import { useAppDispatch } from '@/store/hooks'
import { openAlert } from '@/store/slices/alertSlice'

interface Props {
  images: UploadData[]
  setImages: Dispatch<SetStateAction<UploadData[]>>
}

export default function ImgForm({ images, setImages }: Props) {
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dispatch = useAppDispatch()

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      setLoading(true)
      const files = e.target.files
      if (!files) {
        setLoading(false)
        return
      }

      if (images.length > 4) {
        dispatch(
          openAlert({
            message: '이미지는 최대 4장까지 첨부할 수 있습니다.',
            severity: 'info',
          })
        )
        setLoading(false)
        return
      }

      const maxSize = 5 * 1024 * 1024

      try {
        const fileArray = Array.from(files)
        const readFilePromises = fileArray.map((file) => {
          if (file.size > maxSize) {
            dispatch(
              openAlert({
                message: '파일 크기는 5MB 이하로 업로드해주세요.',
                severity: 'warning',
              })
            )
            e.target.value = ''
            return ''
          } else {
            return new Promise<string>((resolve, reject) => {
              const reader = new FileReader()
              reader.onload = () => resolve(reader.result as string)
              reader.onerror = () => reject(reader.error)
              reader.readAsDataURL(file)
            })
          }
        })

        const newImages = await Promise.all(readFilePromises)

        setImages((prev) => {
          const add = newImages.map((img, i) => ({ url: img, file: files[i], alt: '' }))
          return [...prev, ...add]
        })
      } catch (error) {
        console.error('파일 읽기 중 오류 발생:', error)
        dispatch(
          openAlert({
            message: '파일을 읽는 중 오류가 발생했습니다.',
            severity: 'error',
          })
        )
      } finally {
        setLoading(false)
      }
    },
    [dispatch, images.length, setImages]
  )

  return (
    <>
      <Tooltip title="이미지 업로드">
        <IconButton
          color="primary"
          loading={loading}
          size="small"
          aria-label="이미지 업로드"
          disabled={images.length > 3}
          onClick={() => fileInputRef.current?.click()}
        >
          <ImageSearch />
        </IconButton>
      </Tooltip>
      <input className="hidden" ref={fileInputRef} id="image" type="file" accept="image/*" multiple onChange={(e) => handleFileChange(e)} />
    </>
  )
}
