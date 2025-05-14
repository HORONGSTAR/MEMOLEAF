'use client'
import { Card, CardContent, Stack } from '@mui/material'
import { ExpandButton, ImgGrid, MemoBox, MemoFooter, MemoHeader } from '@/components'
import { editImageUrl } from '@/lib/utills'
import { Memo } from '@/lib/types'
import { AutoStoriesOutlined } from '@mui/icons-material'
import Link from 'next/link'

interface Props {
  posts: Memo[]
}

export default function MyPostItem({ posts }: Props) {
  return (
    <Stack spacing={2} my={2}>
      {posts.map((post) => (
        <Card variant="outlined" key={post.id}>
          <MemoBox
            {...post}
            header={<MemoHeader variant="list" {...post} />}
            footer={
              <MemoFooter id={post.id} _count={post._count}>
                <ExpandButton LinkComponent={Link} href={`/page/memo/${post.id}`}>
                  <AutoStoriesOutlined fontSize="small" />
                  <span className="label">페이지</span>
                </ExpandButton>
              </MemoFooter>
            }
          >
            <CardContent>{post.content}</CardContent>
            <ImgGrid images={editImageUrl(post.images)} />
          </MemoBox>
        </Card>
      ))}
    </Stack>
  )
}
