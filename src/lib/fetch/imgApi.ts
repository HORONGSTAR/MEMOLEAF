import { uploadUrl, metaData } from '@/lib/fetch/fetchApi'

const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })
}

export async function uploadImages(files: File[]) {
  const newPreviewImages: string[] = []

  const base64Promises = files.map((file) =>
    convertToBase64(file).then((base64) => {
      newPreviewImages.push(base64)
      return base64
    })
  )

  const base64Images = await Promise.all(base64Promises)

  const data = metaData('POST', { images: base64Images })
  const res = await fetch(uploadUrl, data)
  if (!res.ok) throw new Error('이미지 업로드 실패')
  const result = await res.json()
  return result.uploads
}
