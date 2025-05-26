import { memosUrl, buildApiCall } from '@/shared/utils/api'
import { uploadImages } from '@/shared/fetch/uploadApi'
import { GetMemosParams, MemoParams } from '@/shared/types/api'

export const fetchMemos = async ({ query }: GetMemosParams) => {
  let queryString = ''
  const keys = Object.keys(query)
  for (const key of keys) {
    queryString += `${key}=${query[key]}&`
  }

  const res = await fetch(memosUrl + `?${queryString}`)
  if (!res.ok) throw new Error('메모 조회 중 에러')
  return res.json()
}

export const createMemo = async (params: MemoParams) => {
  const { formData, files, imgs } = params
  let images

  if (files.length > 0) {
    const uploads: string[] = await uploadImages(files)
    images = imgs.map((img, i) => ({ url: uploads[i], alt: img.alt }))
  }

  const data = buildApiCall('POST', { ...formData, images })
  const res = await fetch(memosUrl, data)
  if (!res.ok) throw new Error('메모 작성 중 에러')
  return res.json()
}

export const updateMemo = async (params: MemoParams) => {
  const { formData, files, imgs } = params
  let images

  if (files.length > 0) {
    const uploads: string[] = await uploadImages(files)
    images = imgs.map((img) => ({ url: img.id ? img.url : uploads.shift(), alt: img.alt }))
  }

  const data = buildApiCall('PATCH', { ...formData, images })
  const res = await fetch(memosUrl, data)
  if (!res.ok) throw new Error('메모 수정 중 에러')
  return res.json()
}

export const deleteMemo = async (id: number) => {
  const data = buildApiCall('DELETE', { id })
  const res = await fetch(memosUrl, data)
  if (!res.ok) throw new Error('메모 삭제 중 에러')
  return res.json()
}
