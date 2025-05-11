import { userUrl, metaData } from '@/lib/api/fetchApi'
import { UserParams } from '@/lib/types'
import { uploadImages } from './imgApi'

export const getUser = async (id: string) => {
  const res = await fetch(userUrl + `/${id}`)
  if (!res.ok) throw new Error('유저 정보 조회 중 에러')
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
