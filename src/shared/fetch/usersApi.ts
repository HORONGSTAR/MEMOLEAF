import { usersUrl, buildApiCall } from '@/shared/utils/api'
import { GetFollowParams, UserParams } from '@/shared/types/api'
import { uploadImages } from '@/shared/fetch/uploadApi'

export const updateProfile = async (params: UserParams) => {
  const { name, info, file } = params
  let image
  if (file) {
    const result = await uploadImages([file])
    image = result[0]
  }
  const data = buildApiCall('PATCH', { name, info, image })
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
  const { id, endpoint, cursor } = params

  const res = await fetch(usersUrl + `/${id}/${endpoint}?cursor=${cursor}`)
  if (!res.ok) return null
  return res.json()
}
