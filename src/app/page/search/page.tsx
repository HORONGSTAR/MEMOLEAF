import { SearchBox } from '@/components'
import { disconnectPrisma } from '@/lib/prisma'

export default async function SearchPage() {
  disconnectPrisma()
  return <SearchBox />
}
