import { postUrl, metaData } from '@/lib/api/fetchApi'
import { Params } from '@/lib/types'

export const getMemos = async (params: Params) => {
  const { page } = params
  const res = await fetch(postUrl + `?page=${page}`)
  if (!res.ok) throw new Error('메모 조회 중 에러')
  return res.json()
}

export const createMemo = async (params: Params) => {
  const { userId, content, images } = params
  const data = metaData('POST', { userId, content, images })
  const res = await fetch(postUrl, data)
  if (!res.ok) throw new Error('메모 작성 중 에러')
  return res.json()
}

export const updateMemo = async (params: Params) => {
  const { id, content } = params
  const data = metaData('PATCH', { id, content })
  const res = await fetch(postUrl, data)
  if (!res.ok) throw new Error('메모 수정 중 에러')
  return res.json()
}

export const deleteMemo = async (params: Params) => {
  const { id } = params
  const data = metaData('DELETE', { id })
  const res = await fetch(postUrl, data)
  if (!res.ok) throw new Error('메모 삭제 중 에러')
  return res.json()
}
