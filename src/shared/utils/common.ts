import dayjs from 'dayjs'

export const now = dayjs()

export const convertDate = (date?: Date) => {
  const isToday = now.isSame(date, 'day')
  return dayjs(date).format(isToday ? 'A hh:mm' : 'YYYY.MM.DD')
}

export const imgPath = process.env.NEXT_PUBLIC_IMG_URL + '/'

export const swapOnOff: {
  [key: 'on' | 'off' | string]: { next: 'on' | 'off'; bool: boolean }
} = { on: { next: 'off', bool: true }, off: { next: 'on', bool: false } }

export const checkOnOff = (besic: number, current: number) => {
  const result: { [key: number]: 'on' | 'off' } = { [current]: 'off', [besic]: 'on' }
  return result[current]
}

export const decosToJson = (decos: { kind: 'subtext' | 'folder' | 'secret'; extra: string }[]) => {
  const result = {
    subtext: { active: 'off', extra: '' },
    folder: { active: 'off', extra: '' },
    secret: { active: 'off', extra: '' },
  }
  decos.forEach((deco) => (result[deco.kind] = { active: 'on', extra: deco.extra }))
  return result
}
