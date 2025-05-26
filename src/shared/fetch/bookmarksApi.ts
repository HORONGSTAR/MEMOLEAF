import { bookmarksUrl, buildApiCall } from '@/shared/utils/api'

export const createBookmark = async (id: number) => {
  const data = buildApiCall('POST', { id })
  const res = await fetch(bookmarksUrl, data)
  if (!res.ok) throw new Error('북마크 추가 중 에러')
  return res.json()
}

export const deleteBookmark = async (id: number) => {
  const data = buildApiCall('DELETE', { id })
  const res = await fetch(bookmarksUrl, data)
  if (!res.ok) throw new Error('북마크 삭제 중 에러')
  return res.json()
}
