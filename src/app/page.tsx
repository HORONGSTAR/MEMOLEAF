import { Wrap } from '@/styles/BaseStyles'
import { PostForm } from '@/components/post/Forms'
import { PostCards } from '@/components/post/Cards'

export default async function HomePage() {
  return (
    <Wrap spacing={2}>
      <PostForm />
      <PostCards />
    </Wrap>
  )
}
