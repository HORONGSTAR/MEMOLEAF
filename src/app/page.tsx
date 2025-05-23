import { MemoList } from '@/components/memo'
import prisma, { disconnectPrisma } from '@/lib/prisma'
export const dynamic = 'force-dynamic'

export default async function HomePage() {
  disconnectPrisma()
  const lastMemo = await prisma.memo.findFirst({
    take: 1,
    select: { id: true },
    orderBy: { createdAt: 'desc' },
  })

  return <MemoList path="home" lastMemoId={lastMemo?.id || 0} />
}
