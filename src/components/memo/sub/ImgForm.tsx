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

  // 압축 함수
  const compressImage = (file: File, maxWidth = 800, quality = 0.8): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()

      img.onload = () => {
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height)
        canvas.width = img.width * ratio
        canvas.height = img.height * ratio

        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height)

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              })
              resolve(compressedFile)
            }
          },
          'image/jpeg',
          quality
        )
      }

      img.src = URL.createObjectURL(file)
    })
  }

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
        const processFilePromises = fileArray.map(async (file) => {
          if (file.size > maxSize) {
            // 크기가 큰 파일은 압축 시도
            try {
              const compressedFile = await compressImage(file)

              if (compressedFile.size > maxSize) {
                dispatch(
                  openAlert({
                    message: '파일 크기는 5MB 이하로 업로드해주세요.',
                    severity: 'warning',
                  })
                )
                e.target.value = ''
                return null
              }

              // 압축된 파일로 진행
              return new Promise<{ url: string; file: File }>((resolve, reject) => {
                const reader = new FileReader()
                reader.onload = () =>
                  resolve({
                    url: reader.result as string,
                    file: compressedFile,
                  })
                reader.onerror = () => reject(reader.error)
                reader.readAsDataURL(compressedFile)
              })
            } catch (error) {
              console.error('이미지 압축 실패:', error)
              dispatch(
                openAlert({
                  message: '파일 크기는 5MB 이하로 업로드해주세요.',
                  severity: 'warning',
                })
              )
              e.target.value = ''
              return null
            }
          } else {
            // 크기가 작은 파일은 그대로 진행
            return new Promise<{ url: string; file: File }>((resolve, reject) => {
              const reader = new FileReader()
              reader.onload = () =>
                resolve({
                  url: reader.result as string,
                  file: file,
                })
              reader.onerror = () => reject(reader.error)
              reader.readAsDataURL(file)
            })
          }
        })

        const results = await Promise.all(processFilePromises)
        const validResults = results.filter((result) => result !== null)

        setImages((prev) => {
          const add = validResults.map((result) => ({
            url: result!.url,
            file: result!.file,
            alt: '',
          }))
          return [...prev, ...add]
        })
      } catch (error) {
        console.error('파일 처리 중 오류 발생:', error)
        dispatch(
          openAlert({
            message: '파일을 처리하는 중 오류가 발생했습니다.',
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
