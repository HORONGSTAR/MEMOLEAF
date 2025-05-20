export const memoUrl = '/api/memo'
export const userUrl = '/api/user'
export const feedbackUrl = '/api/feedback'
export const uploadUrl = '/api/upload'
export const controlUrl = '/api/control'

export const metaData = (method: string, data: unknown) => {
  return {
    method: method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }
}
