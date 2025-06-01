import { settingsUrl, buildApiCall } from '@/shared/utils/api'

export const deleteAllMemos = async (id: number) => {
  const data = buildApiCall('DELETE', { id })
  const res = await fetch(settingsUrl + '/posts', data)
  if (!res.ok) throw new Error('메모 삭제 중 문제가 발생했습니다.')
  return res.json()
}

export const deleteUserAccount = async (id: number) => {
  const data = buildApiCall('DELETE', { id })
  const res = await fetch(settingsUrl + '/account', data)
  if (!res.ok) throw new Error('계정 삭제 중 문제가 발생했습니다.')
  return res.json()
}
