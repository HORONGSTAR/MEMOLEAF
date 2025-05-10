import { memoUrl, metaData } from '@/lib/api/fetchApi'
import { uploadImages, deleteImages } from './imgApi'
import { MemoParams } from '@/lib/types'

export const getMemos = async (page: number) => {
  const res = await fetch(memoUrl + `?page=${page}`)
  if (!res.ok) throw new Error('메모 조회 중 에러')
  return res.json()
}

export const getMemoById = async (id: string) => {
  const res = await fetch(memoUrl + `/${id}`)
  if (!res.ok) throw new Error('메모 조회 중 에러')
  return res.json()
}

export const createMemo = async (params: MemoParams) => {
  const { id, content, images, decos } = params
  const data = metaData('POST', { id, content, images: images.add, decos })
  if (images.file.length > 0) await uploadImages(images.file)

  const res = await fetch(memoUrl, data)
  if (!res.ok) throw new Error('메모 작성 중 에러')
  return res.json()
}

export const updateMemo = async (params: MemoParams) => {
  const { id, content, images, decos } = params

  if (images.file.length > 0) await uploadImages(images.file)
  if (images.del.length > 0) await deleteImages(images.del)

  const data = metaData('PATCH', { id, content, images: images.add, decos })

  const res = await fetch(memoUrl, data)
  if (!res.ok) throw new Error('메모 수정 중 에러')
  return res.json()
}

export const deleteMemo = async (params: Pick<MemoParams, 'id' | 'images'>) => {
  const { id, images } = params
  const data = metaData('DELETE', { id })
  if (images.del.length > 0) await deleteImages(images.del)
  const res = await fetch(memoUrl, data)
  if (!res.ok) throw new Error('메모 삭제 중 에러')
  return res.json()
}
