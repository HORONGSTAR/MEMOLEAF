import { CommentParams } from '@/shared/types/api'
import { commentsUrl, buildApiCall } from '@/shared/utils/api'

export const fetchComments = async (page: number, id: number) => {
  const res = await fetch(commentsUrl + `/${id}?page=${page}`)
  if (!res.ok) throw new Error('댓글 조회 중 에러')
  return res.json()
}

export const createComment = async (params: CommentParams) => {
  const data = buildApiCall('POST', params)
  const res = await fetch(commentsUrl, data)
  if (!res.ok) throw new Error('댓글 작성 중 에러')
  return res.json()
}

export const updateComment = async (params: CommentParams) => {
  const data = buildApiCall('PATCH', params)
  const res = await fetch(commentsUrl, data)
  if (!res.ok) throw new Error('댓글 수정 중 에러')
  return res.json()
}

export const deleteComment = async (id: number) => {
  const data = buildApiCall('DELETE', { id })
  const res = await fetch(commentsUrl, data)
  if (!res.ok) throw new Error('댓글 삭제 중 에러')
  return res.json()
}
