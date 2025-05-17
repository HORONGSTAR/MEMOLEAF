'use client'
import { AutoStoriesOutlined } from '@mui/icons-material'
import { Button } from '@mui/material'
import Link from 'next/link'

interface Props {
  id: number
  count: number
}

export default function MemoLink(props: Props) {
  const { id, count } = props

  if (count > 0)
    return (
      <Button component={Link} startIcon={<AutoStoriesOutlined />} href={`/page/memo/${id}`}>
        {count}개의 타래
      </Button>
    )
  else return null
}
