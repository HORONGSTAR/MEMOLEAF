import { userUrl, metaData } from '@/lib/api/fetchApi'
import { Params } from '@/lib/types'

export const getUser = async (id: string) => {
  const res = await fetch(userUrl + `?id=${id}`)
  if (!res.ok) throw new Error('유저 정보 조회 중 에러')
  return res.json()
}

export const updateUser = async (params: Params) => {
  const { id, name, info } = params
  const data = metaData('POST', { id, name, info })
  const res = await fetch(userUrl, data)
  if (!res.ok) throw new Error('유저 정보 수정 중 에러')
  return res.json()
}
