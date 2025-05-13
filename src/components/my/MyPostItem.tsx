'use client'
import { Card, Stack } from '@mui/material'
import { ImgGrid, MemoBox } from '@/components'
import { editImageUrl } from '@/lib/utills'
import { Memo } from '@/lib/types'

interface Props {
  posts: Memo[]
}

export default function MyPostItem({ posts }: Props) {
  return (
    <Stack spacing={2} my={2}>
      {posts.map((post) => (
        <Card variant="outlined" key={post.id}>
          <MemoBox {...post} headerStyle="list">
            {post.content}
            <ImgGrid images={editImageUrl(post.images)} />
          </MemoBox>
        </Card>
      ))}
    </Stack>
  )
}
