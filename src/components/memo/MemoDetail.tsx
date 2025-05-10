import { Memo } from '@/lib/types'
import { MemoCard } from '@/components'

interface Props {
  memo: Memo
}
export default function MemoDetail(props: Props) {
  const { memo } = props

  return <MemoCard {...memo} />
}
