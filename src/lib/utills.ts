import dayjs from 'dayjs'
import { v4 as uuid } from 'uuid'
import { Image } from '@/lib/types'

export const changeDate = (date: string, format?: string) => dayjs(date).format(format || 'YYYY.MM.DD HH:mm')

export const imgPath = process.env.NEXT_PUBLIC_IMG_URL + '/uploads/'

export const addImagePath = (images: Image[]) => images.map((img) => ({ ...img, url: imgPath + img.url }))

export const copyText = async (text: string, label: string) => {
  try {
    await navigator.clipboard.writeText(text)
    return label + ' 클립보드에 복사했습니다.'
  } catch (err) {
    console.error('복사 실패:', err)
    return label + ' 복사하는 중 문제가 발생했습니다.'
  }
}

export const swapOnOff: {
  [key: string]: {
    next: string
    bool: boolean
  }
} = {
  on: { next: 'off', bool: true },
  off: { next: 'on', bool: false },
}

const adj = ['짓궂은', '나른한', '씩씩한', '심심한', '차분한', '발랄한', '담담한', '성실한', '용감한', '진지한']
const word = ['딸기', '레몬', '바나나', '사과', '아보카도', '체리', '파인애플', '포도']

export const randomProfile = () => {
  const index1 = Math.floor(Math.random() * 10)
  const index2 = Math.floor(Math.random() * 8)
  return { name: `${adj[index1]} ${word[index2]}`, image: `/default-avatar-${index2}.png` }
}

export function generateUserNum(userId: number) {
  const year = new Date().getFullYear().toString().slice(-2)
  const padded = userId.toString().padStart(4, '0')
  return parseInt(`${year}${padded}`)
}

export const setRenameFile = (file: File) => {
  const ext = file.type.split('/')[1]
  const rename = `${uuid()}.${ext}`
  return new File([file], rename, { type: file.type })
}
