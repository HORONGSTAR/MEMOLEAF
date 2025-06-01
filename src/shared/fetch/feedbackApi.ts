import { feedbackUrl, buildApiCall } from '@/shared/utils/api'

export const createBookmark = async (id: number) => {
  const data = buildApiCall('POST', { id })
  const res = await fetch(feedbackUrl + '/bookmarks', data)
  if (!res.ok) throw new Error('북마크 추가 중 문제가 발생했습니다.')
  return res.json()
}

export const deleteBookmark = async (id: number) => {
  const data = buildApiCall('DELETE', { id })
  const res = await fetch(feedbackUrl + '/bookmarks', data)
  if (!res.ok) throw new Error('북마크 취소 중 문제가 발생했습니다.')
  return res.json()
}

export const createFavorite = async (id: number) => {
  const data = buildApiCall('POST', { id })
  const res = await fetch(feedbackUrl + '/favorites', data)
  if (!res.ok) throw new Error('좋아요 추가 중 문제가 발생했습니다.')
  return res.json()
}

export const deleteFavorite = async (id: number) => {
  const data = buildApiCall('DELETE', { id })
  const res = await fetch(feedbackUrl + '/favorites', data)
  if (!res.ok) throw new Error('좋아요 취소 중 문제가 발생했습니다.')
  return res.json()
}
