'use client'
import { IconButton } from '@mui/material'
import imageCompression from 'browser-image-compression'
import { useRef, Dispatch, SetStateAction } from 'react'
import { ImgModal } from '@/components'
import { ImageSearch } from '@mui/icons-material'

interface Props {
  imgUrls: string[]
  setImgFiles: Dispatch<SetStateAction<File[]>>
  setImgUrls: Dispatch<SetStateAction<string[]>>
}

export default function ImgForm(props: Props) {
  const { setImgFiles, imgUrls, setImgUrls } = props
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    if (files.length > 3) return alert('이미지는 최대 4장까지 첨부할 수 있어요.')

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
    setImgUrls((prev) => [...prev, ...newImgUrls])
  }

  const removeFile = (index: number) => {
    setImgFiles((prev) => prev.filter((_, i) => i !== index))
    setImgUrls((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div>
      <IconButton disabled={imgUrls.length > 3} onClick={() => fileInputRef.current?.click()}>
        <ImageSearch />
      </IconButton>
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
        {imgUrls.map((url, index) => (
          <div key={index} className="relative w-24 h-24">
            <ImgModal imgUrl={url} label={`image${index}`} />
            <button
              type="button"
              onClick={() => removeFile(index)}
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
