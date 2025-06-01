import { usersUrl, buildApiCall } from '@/shared/utils/api'
import { GetFollowParams, UserParams } from '@/shared/types/api'

export const updateProfile = async (params: UserParams) => {
  const data = buildApiCall('PATCH', params)
  const res = await fetch(usersUrl, data)
  if (!res.ok) throw new Error('유저 정보 수정 중 문제가 발생했습니다.')
  return res.json()
}

export const followUser = async (followingId: number) => {
  const data = buildApiCall('POST', { followingId })
  const res = await fetch(usersUrl, data)
  if (!res.ok) throw new Error('팔로우 중 문제가 발생했습니다.')
  return res.json()
}

export const unfollowUser = async (followingId: number) => {
  const data = buildApiCall('DELETE', { followingId })
  const res = await fetch(usersUrl, data)
  if (!res.ok) throw new Error('언팔로우 중 문제가 발생했습니다.')
  return res.json()
}

export const fetchtUsers = async ({ endpoint, query }: GetFollowParams) => {
  let queryString = ''
  const keys = Object.keys(query)
  for (const key of keys) {
    queryString += `${key}=${query[key]}&`
  }

  const res = await fetch(usersUrl + `/${endpoint}?${queryString}`)
  if (!res.ok) return null
  return res.json()
}
