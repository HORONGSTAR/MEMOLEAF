import { Wrap, MyProfile, MyPost } from '@/components'
import { getUser } from '@/lib/api/userApi'

interface PageProps {
  params: { id: string }
}

export default async function Page({ params }: PageProps) {
  const { id } = await params
  const user = await getUser(id)

  return (
    <Wrap>
      <MyProfile {...user} />
      <MyPost id={id} />
    </Wrap>
  )
}
