import { metaData, controlUrl } from './fetchApi'

export const deleteAllMemos = async (id: number) => {
  const data = metaData('DELETE', { id })
  const res = await fetch(controlUrl + '/memo', data)
  if (!res.ok) throw new Error('메모 삭제 중 에러')
  return res.json()
}

export const deleteUserAccount = async (id: number) => {
  const data = metaData('DELETE', { id })
  const res = await fetch(controlUrl + '/account', data)
  if (!res.ok) throw new Error('계정 삭제 중 에러')
  return res.json()
}
