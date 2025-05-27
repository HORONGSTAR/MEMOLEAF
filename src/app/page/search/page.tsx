import SearchContainer from '@/components/container/SearchContainer'
import prisma from '@/lib/prisma'

export default async function SearchPage() {
  const lastMemo = await prisma.memo.findFirst({
    take: 1,
    select: { id: true },
    orderBy: { createdAt: 'desc' },
  })
  return <SearchContainer lastMemoId={lastMemo?.id || 0} />
}
