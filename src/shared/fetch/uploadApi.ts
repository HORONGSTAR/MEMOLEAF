import { uploadUrl, buildApiCall } from '@/shared/utils/api'
import { UploadData } from '../types/client'

export async function uploadImages(images: UploadData[], id: number) {
  if (images.length === 0) return

  const data = buildApiCall('POST', { images, id })
  await fetch(uploadUrl, data)
  return
}
