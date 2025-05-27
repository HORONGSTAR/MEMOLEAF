import { alarmUrl, buildApiCall } from '@/shared/utils/api'

export const deleteAlarm = async () => {
  const data = buildApiCall('DELETE', {})
  const res = await fetch(alarmUrl, data)
  if (!res.ok) throw new Error('알림 제거 중 에러')
  return res.json()
}
