import { usersUrl, buildApiCall } from '@/shared/utils/api'
import { GetFollowParams, UserParams } from '@/shared/types/api'
import { uploadImages } from '@/shared/fetch/uploadApi'

export const fetchProfile = async (id: number | string) => {
  const res = await fetch(usersUrl + `/${id}/my`)
  if (!res.ok) return null
  return res.json()
}

export const updateProfile = async (params: UserParams) => {
  const { name, info, file } = params
  let images
  if (file) {
    const result = await uploadImages([file])
    images = result[0]
  }
  const data = buildApiCall('PATCH', { name, info, image: images })
  const res = await fetch(usersUrl, data)
  if (!res.ok) throw new Error('유저 정보 수정 중 에러')
  return res.json()
}

export const followUser = async (toUserId: number) => {
  const data = buildApiCall('POST', { toUserId })
  const res = await fetch(usersUrl, data)
  if (!res.ok) throw new Error('팔로우 중 에러')
  return res.json()
}

export const unfollowUser = async (toUserId: number) => {
  const data = buildApiCall('DELETE', { toUserId })
  const res = await fetch(usersUrl, data)
  if (!res.ok) throw new Error('팔로우 중 에러')
  return res.json()
}

export const fetchtFollow = async (params: GetFollowParams) => {
  const { id, endpoint } = params

  const res = await fetch(usersUrl + `/${id}/${endpoint}`)
  if (!res.ok) return null
  return res.json()
}
