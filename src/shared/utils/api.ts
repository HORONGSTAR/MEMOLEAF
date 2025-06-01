export const memosUrl = '/api/memos'
export const uploadUrl = '/api/upload'
export const commentsUrl = '/api/comments'
export const feedbackUrl = '/api/feedback'
export const notificationUrl = '/api/notifications'
export const usersUrl = '/api/users'
export const settingsUrl = '/api/settings'

export const buildApiCall = (method: string, data: unknown) => {
  return {
    method: method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }
}
