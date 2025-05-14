import { userUrl, metaData } from '@/lib/api/fetchApi'
import { FollowParams, UserParams } from '@/lib/types'
import { uploadImages } from '@/lib/api/imgApi'

export const getUser = async (id: number | string) => {
  const res = await fetch(userUrl + `/${id}`)
  if (!res.ok) return null
  return res.json()
}

export const updateUser = async (params: UserParams) => {
  const { id, name, image, info, file } = params
  const data = metaData('PATCH', { id, name, image, info })
  const res = await fetch(userUrl, data)

  if (file) await uploadImages([file])
  if (!res.ok) throw new Error('유저 정보 수정 중 에러')
  return res.json()
}

export const followUser = async (params: FollowParams) => {
  const data = metaData('POST', params)
  const res = await fetch(userUrl, data)
  if (!res.ok) throw new Error('팔로우 중 에러')
  return res.json()
}

export const unfollowUser = async (params: FollowParams) => {
  const data = metaData('DELETE', params)
  const res = await fetch(userUrl, data)
  if (!res.ok) throw new Error('언팔로우 중 에러')
  return res.json()
}
