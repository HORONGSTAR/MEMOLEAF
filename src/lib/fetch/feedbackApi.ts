import { feedbackApi, metaData } from '@/lib/fetch/fetchApi'
import { BookmarkParams, CommentParams, QueryString } from '@/lib/types'

export const getComments = async (params: QueryString, id: number) => {
  const keys = Object.keys(params)
  let query = ''
  for (const key of keys) {
    query += `${key}=${params[key]}&`
  }
  const res = await fetch(feedbackApi + `/comment/${id}?${query}`)
  if (!res.ok) throw new Error('댓글 조회 중 에러')
  return res.json()
}

export const createComment = async (params: CommentParams) => {
  const data = metaData('POST', params)
  const res = await fetch(feedbackApi + '/comment', data)
  if (!res.ok) throw new Error('댓글 작성 중 에러')
  return res.json()
}

export const updateComment = async (params: CommentParams) => {
  const data = metaData('PATCH', params)
  const res = await fetch(feedbackApi + '/comment', data)
  if (!res.ok) throw new Error('댓글 수정 중 에러')
  return res.json()
}

export const deleteComment = async (id: number) => {
  const data = metaData('DELETE', { id })
  const res = await fetch(feedbackApi + '/comment', data)
  if (!res.ok) throw new Error('메모 삭제 중 에러')
  return res.json()
}

export const BookmarkMemo = async (params: BookmarkParams) => {
  const { id, action } = params
  const method = { check: 'POST', uncheck: 'DELETE' }[action]
  const data = metaData(method || 'POST', { id })
  const res = await fetch(feedbackApi + '/bookmark', data)
  if (!res.ok) throw new Error('북마크 중 에러')
  return res.json()
}

export const getAlarm = async () => {
  const res = await fetch(feedbackApi + '/alarm')
  if (!res.ok) throw new Error('알림 추가 중 에러')
  return res.json()
}

export const removeAlarm = async () => {
  const data = metaData('DELETE', {})
  const res = await fetch(feedbackApi + '/alarm', data)
  if (!res.ok) throw new Error('알림 제거 중 에러')
  return res.json()
}
