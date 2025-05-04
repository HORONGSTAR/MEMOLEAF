import { postUrl, metaData } from '@/lib/api/fetchApi'
import { uploadImages, deleteImages } from './imgApi'
import { MemoParamsCU, MemoParamsD } from '@/lib/types'

export const getMemos = async (page: number) => {
  const res = await fetch(postUrl + `?page=${page}`)
  if (!res.ok) throw new Error('메모 조회 중 에러')
  return res.json()
}

export const createMemo = async (params: MemoParamsCU) => {
  const { id, content, images, files } = params
  const data = metaData('POST', { id, content, images: images.create })
  if (files.length > 0) await uploadImages(files)

  const res = await fetch(postUrl, data)
  if (!res.ok) throw new Error('메모 작성 중 에러')
  return res.json()
}

export const updateMemo = async (params: MemoParamsCU) => {
  const { id, content, images, files } = params

  if (files.length > 0) await uploadImages(files)
  if (images.remove.length > 0) await deleteImages(images.remove)

  const data = metaData('PATCH', { id, content, images: images.create })

  const res = await fetch(postUrl, data)
  if (!res.ok) throw new Error('메모 수정 중 에러')
  return res.json()
}

export const deleteMemo = async (params: MemoParamsD) => {
  const { id, images } = params
  const data = metaData('DELETE', { id })
  if (images.remove.length > 0) await deleteImages(images.remove)
  const res = await fetch(postUrl, data)
  if (!res.ok) throw new Error('메모 삭제 중 에러')
  return res.json()
}
