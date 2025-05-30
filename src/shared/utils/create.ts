const adj = ['짓궂은', '나른한', '씩씩한', '심심한', '차분한', '발랄한', '담담한', '성실한', '용감한', '진지한']

const word = ['딸기', '레몬', '바나나', '사과', '아보카도', '체리', '파인애플', '포도']

export const generateRandomProfile = () => {
  const index1 = Math.floor(Math.random() * 10)
  const index2 = Math.floor(Math.random() * 8)
  return { name: `${adj[index1]} ${word[index2]}`, image: `/default-avatar-${index2}.png` }
}

export function generateUserNum(userId: number) {
  const year = new Date().getFullYear().toString().slice(-2)
  const padded = userId.toString().padStart(4, '0')
  return parseInt(`${year}${padded}`)
}
