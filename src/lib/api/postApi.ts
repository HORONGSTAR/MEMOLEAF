import { postUrl, metaData } from '@/lib/api/fetchApi'
import { uploadImages, deleteImages } from './imgApi'
import { Params } from '@/lib/types'

export const getMemos = async (params: Params) => {
  const { page } = params
  const res = await fetch(postUrl + `?page=${page}`)
  if (!res.ok) throw new Error('메모 조회 중 에러')
  return res.json()
}

export const createMemo = async (params: Params) => {
  const { id, content, images, files } = params
  const data = metaData('POST', { id, content, images })
  if (files && files.length > 0) await uploadImages(files)

  const res = await fetch(postUrl, data)
  if (!res.ok) throw new Error('메모 작성 중 에러')
  return res.json()
}

export const updateMemo = async (params: Params) => {
  const { id, content, images, files, rmImgs } = params
  if (files && files.length > 0) await uploadImages(files)
  if (rmImgs && rmImgs.url.length > 0) await deleteImages(rmImgs.url)
  const data = metaData('PATCH', { id, content, images, rmImgs: rmImgs && rmImgs.id })
  const res = await fetch(postUrl, data)
  if (!res.ok) throw new Error('메모 수정 중 에러')
  return res.json()
}

export const deleteMemo = async (params: Params) => {
  const { id, images } = params
  const data = metaData('DELETE', { id })
  if (images && images.length > 0) await deleteImages(images)
  const res = await fetch(postUrl, data)
  if (!res.ok) throw new Error('메모 삭제 중 에러')
  return res.json()
}
