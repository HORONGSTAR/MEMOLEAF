import { MemoForm, MemoCard, Wrap } from '@/components'

export default async function HomePage() {
  return (
    <Wrap spacing={2}>
      <MemoForm />
      <MemoCard />
    </Wrap>
  )
}
