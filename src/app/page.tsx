import { MemoIndex, Wrap, Navbar } from '@/components'

export default async function HomePage() {
  return (
    <>
      <Navbar />
      <Wrap spacing={2}>
        <MemoIndex />
      </Wrap>
    </>
  )
}
