const ApiUrl = process.env.NEXT_PUBLIC_URL
export const imgUrl = process.env.NEXT_PUBLIC_IMG_URL + '/'
export const memoUrl = `${ApiUrl}/api/memo`
export const userUrl = `${ApiUrl}/api/user`

export const metaData = (method: string, data: unknown) => {
  return {
    method: method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }
}
