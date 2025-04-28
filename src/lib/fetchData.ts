import { NextRequest } from 'next/server'

const url = process.env.NEXT_PUBLIC_URL

export const getProfile = async (id: string) => {
  const res = await fetch(`${url}/api/profile?id=${id}`)
  const data = await res.json()
  if (res.status === 200) {
    return data
  } else {
    throw new Error('프로필 조회 중 에러')
  }
}

export const updateProfile = async (data: NextRequest) => {
  const res = await fetch(`${url}/api/auth/signup`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('프로필 수정 중 에러')
  return res.json()
}

export const getMemo = async (page: string, limit: string) => {
  const res = await fetch(`${url}/api/post?page=${page}&limit=${limit}`)
  const { data } = await res.json()
  if (res.status === 200) {
    return data
  } else {
    throw new Error('게시물 조회 중 에러')
  }
}

export const createMemo = async (userId: number, content: string) => {
  const res = await fetch(`${url}/api/post`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, content }),
  })
  if (!res.ok) throw new Error('게시물 작성 중 에러')
  return res.json()
}

export const updateMemo = async (id: number, content: string) => {
  const res = await fetch(`${url}/api/post`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id, content }),
  })
  if (!res.ok) throw new Error('게시물 수정 중 에러')
  return res.json()
}

export const deleteMemo = async (id: number) => {
  const res = await fetch(`${url}/api/post`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id }),
  })
  if (!res.ok) throw new Error('게시물 삭제 중 에러')
  return res.json()
}
