import { MemoList } from '@/components'
import { disconnectPrisma } from '@/lib/prisma'
export const dynamic = 'force-dynamic'

export default async function HomePage() {
  disconnectPrisma()

  return <MemoList path="home" />
}
