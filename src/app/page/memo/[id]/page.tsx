import { getMemoById } from '@/lib/api/memoApi'
import { MemoDetail } from '@/components'

interface PageProps {
  params: { id: string }
}

export default async function Page({ params }: PageProps) {
  const { id } = await params
  const memo = await getMemoById(id)
  return <MemoDetail {...memo} />
}
