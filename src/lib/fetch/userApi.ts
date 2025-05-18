import { userUrl, metaData } from '@/lib/fetch/fetchApi'
import { FollowParams, QueryString, UserParams } from '@/lib/types'
import { uploadImages } from '@/lib/fetch/imgApi'

export const getProfile = async (id: number | string) => {
  const res = await fetch(userUrl + `/my/${id}`)
  if (!res.ok) return null
  return res.json()
}

export const updateProfile = async (params: UserParams) => {
  const { name, image, info, file } = params
  const data = metaData('PATCH', { name, image, info })
  const res = await fetch(userUrl + '/my', data)

  if (file) await uploadImages([file])
  if (!res.ok) throw new Error('유저 정보 수정 중 에러')
  return res.json()
}

export const followUser = async (params: FollowParams) => {
  const { fromUserId, toUserId, action } = params
  const method = { follow: 'POST', unfollow: 'DELETE' }[action]
  const data = metaData(method || 'POST', { fromUserId, toUserId })
  const res = await fetch(userUrl + '/follow', data)
  if (!res.ok) throw new Error('팔로우 중 에러')
  return res.json()
}

export const getFollows = async (query: QueryString) => {
  const { id, ListAria } = query
  const res = await fetch(userUrl + `/follow/${id}/${ListAria}`)
  if (!res.ok) return null
  return res.json()
}
