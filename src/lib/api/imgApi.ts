import { imgUrl, metaData } from '@/lib/api/fetchApi'

export async function uploadImages(files: File[]) {
  const formData = new FormData()
  files.forEach((file) => {
    formData.append('images', file)
  })
  const res = await fetch(imgUrl, {
    method: 'POST',
    body: formData,
  })
  if (!res.ok) throw new Error('이미지 업로드 실패')
  return res.json()
}

export async function removeImages(fileNames: string[]) {
  const data = metaData('DELETE', { fileNames })
  await fetch(imgUrl, data)
  return
}
