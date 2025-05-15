import { MemoList, Wrap } from '@/components'
import { getMemos } from '@/lib/api/memoApi'

export default async function HomePage() {
  const data = await getMemos({ page: 1, limit: 5 })

  return (
    <Wrap>
      <MemoList {...data} />
    </Wrap>
  )
}
