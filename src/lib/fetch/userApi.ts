import { userUrl, metaData } from '@/lib/fetch/fetchApi'
import { FollowParams, GetDataParams, UserParams } from '@/lib/types'
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
  const { toUserId, action } = params
  const method = { follow: 'POST', unfollow: 'DELETE' }[action]
  const data = metaData(method || 'POST', { toUserId })
  const res = await fetch(userUrl + '/follow', data)
  if (!res.ok) throw new Error('팔로우 중 에러')
  return res.json()
}

export const getUsers = async (params: GetDataParams) => {
  const { category, pagination } = params
  let endpoint = ''
  let queryString = ''

  if (category) {
    const key = Object.keys(category)[0]
    endpoint += `/${category[key]}/${key}`
  }

  if (pagination) {
    const keys = Object.keys(pagination)
    for (const key of keys) {
      queryString += `${key}=${pagination[key]}&`
    }
  }
  const res = await fetch(userUrl + `${endpoint}?${queryString}`)
  if (!res.ok) return null
  return res.json()
}
