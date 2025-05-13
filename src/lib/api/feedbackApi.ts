import { feedbackApi, metaData } from '@/lib/api/fetchApi'
import { CommentParams, QueryString } from '@/lib/types'

export const getComments = async (params: QueryString, id: number) => {
  const keys = Object.keys(params)
  let query = ''
  for (const key of keys) {
    query += `${key}=${params[key]}&`
  }
  const res = await fetch(feedbackApi + `/${id}?${query}`)
  if (!res.ok) throw new Error('댓글 조회 중 에러')
  return res.json()
}

export const createComment = async (params: CommentParams) => {
  const data = metaData('POST', params)
  const res = await fetch(feedbackApi, data)
  if (!res.ok) throw new Error('댓글 작성 중 에러')
  return res.json()
}

export const updateComment = async (params: CommentParams) => {
  const data = metaData('PATCH', params)
  const res = await fetch(feedbackApi, data)
  if (!res.ok) throw new Error('댓글 수정 중 에러')
  return res.json()
}

export const deleteComment = async (id: number) => {
  const data = metaData('DELETE', { id })
  const res = await fetch(feedbackApi, data)
  if (!res.ok) throw new Error('메모 삭제 중 에러')
  return res.json()
}
