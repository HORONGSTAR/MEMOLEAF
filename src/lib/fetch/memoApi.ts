import { memoUrl, metaData } from '@/lib/fetch/fetchApi'
import { uploadImages } from './imgApi'
import { MemoParams, GetDataParams } from '@/lib/types'

export const getMemos = async (params: GetDataParams) => {
  const { category, pagination } = params
  let endpoint = ''
  let queryString = ''

  if (category) {
    const key = Object.keys(category)[0]
    endpoint += `/${category[key]}/${key}`
  }

  if (pagination) {
    const keys = Object.keys(pagination)
    for (const key of keys) {
      queryString += `${key}=${pagination[key]}&`
    }
  }

  const res = await fetch(memoUrl + `${endpoint}?${queryString}`)
  if (!res.ok) throw new Error('메모 조회 중 에러')
  return res.json()
}

export const createMemo = async (params: MemoParams) => {
  const { id, content, images, decos, parentId } = params

  let imageUrl

  if (images.file.length > 0) {
    const uploads = await uploadImages(images.file)
    imageUrl = images.imgs.map((img, i) => ({ url: uploads[i], alt: img.alt }))
  }
  const data = metaData('POST', { id, content, images: imageUrl, decos, parentId })

  const res = await fetch(memoUrl, data)
  if (!res.ok) throw new Error('메모 작성 중 에러')
  return res.json()
}

export const updateMemo = async (params: MemoParams) => {
  const { id, content, images, decos } = params

  let imageUrl

  if (images.file.length > 0) {
    const uploads = await uploadImages(images.file)
    imageUrl = images.imgs.map((img, i) => ({ url: uploads[i], alt: img.alt }))
  }
  const data = metaData('PATCH', { id, content, images: imageUrl, decos })
  const res = await fetch(memoUrl, data)
  if (!res.ok) throw new Error('메모 수정 중 에러')
  return res.json()
}

export const deleteMemo = async (id: number) => {
  const data = metaData('DELETE', { id })
  const res = await fetch(memoUrl, data)
  if (!res.ok) throw new Error('메모 삭제 중 에러')
  return res.json()
}
