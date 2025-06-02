import { notificationUrl, buildApiCall } from '@/shared/utils/api'

export const fetchNotifications = async (cursor?: number) => {
  const res = await fetch(notificationUrl + `?cursor=${cursor || ''}`)
  if (!res.ok) throw new Error('알림 목록 조회 중 문제가 발생했습니다.')
  return res.json()
}

export const deleteNotifications = async () => {
  const data = buildApiCall('DELETE', {})
  const res = await fetch(notificationUrl, data)
  if (!res.ok) throw new Error('알림 삭제 중 문제가 발생했습니다.')
  return res.json()
}
