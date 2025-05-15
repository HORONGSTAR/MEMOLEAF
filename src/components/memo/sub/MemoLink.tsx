'use client'
import { ExpandButton } from '@/components'
import { AutoStoriesOutlined } from '@mui/icons-material'
import Link from 'next/link'

interface Props {
  id: number
}

export default function MemoLink(props: Props) {
  const { id } = props

  return (
    <ExpandButton component={Link} href={`/memo/${id}`}>
      <AutoStoriesOutlined fontSize="small" />
      <span className="label">페이지</span>
    </ExpandButton>
  )
}
