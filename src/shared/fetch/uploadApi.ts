import { uploadUrl, buildApiCall } from '@/shared/utils/api'
import { UploadData } from '../types/client'

export async function uploadImages(images: UploadData[], id: number) {
  if (images.length === 0) return

  const data = buildApiCall('POST', { images, id })
  const res = await fetch(uploadUrl, data)
  if (!res.ok) throw new Error('이미지 업로드 중 문제가 발생했습니다.')
  return
}
