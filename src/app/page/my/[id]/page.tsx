import { Wrap, Profile } from '@/components'
import { getMemos } from '@/lib/api/memoApi'
import { getUser } from '@/lib/api/userApi'

interface PageProps {
  params: { id: string }
}

export default async function Page({ params }: PageProps) {
  const { id } = await params
  const user = await getUser(id as string)
  const myMemos = await getMemos(1, id as string)

  return (
    <Wrap>
      <Profile user={user} myMemos={myMemos} />
    </Wrap>
  )
}
