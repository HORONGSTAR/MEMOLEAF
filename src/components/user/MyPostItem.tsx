'use client'
import { MemoBox, AsyncBox } from '@/components'
import { getMemos } from '@/lib/fetch/memoApi'
import { OnOffItem, MemoData, EndPoint, Status } from '@/lib/types'
import { checkCurrentOnOff } from '@/lib/utills'
import { Box, Button, Divider, Stack } from '@mui/material'
import { useCallback, useEffect, useRef, useState } from 'react'

interface Props {
  endpoint?: EndPoint
}

export default function MyPostItem({ endpoint }: Props) {
  const [posts, setPosts] = useState<MemoData[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState<Status>('idle')
  const pageRef = useRef<HTMLDivElement>(null)
  const limit = 10
  const totalPage = Math.ceil(total / limit)

  useEffect(() => {
    setStatus('loading')
    getMemos({ category: endpoint, pagination: { page, limit } })
      .then((result) => {
        setPosts(result.memos)
        setTotal(result.total)
        setStatus('succeeded')
      })
      .catch(() => setStatus('failed'))
  }, [endpoint, page])

  useEffect(() => {
    if (page > 1) {
      setTimeout(() => {
        if (pageRef.current) {
          pageRef.current.scrollIntoView({ behavior: 'smooth' })
        } else {
        }
      }, 1000)
    }
  }, [page])

  const handleNextPage = useCallback(() => {
    setPosts((prev) => [...posts, ...prev])
    setPage((prev) => prev + 1)
  }, [posts])

  const isLast = checkCurrentOnOff(totalPage || 1, page)

  const pageButton: OnOffItem = {
    off: (
      <Divider>
        <Button onClick={handleNextPage}>
          더 보기{page}/{totalPage}
        </Button>
      </Divider>
    ),
    on: null,
  }

  return (
    <AsyncBox state={status}>
      <Stack spacing={2}>
        {posts.map((memo: MemoData) => (
          <MemoBox key={'my-Posts' + memo.id} memo={memo} layout="card" />
        ))}
        {pageButton[isLast]}
      </Stack>
      <Box ref={pageRef} />
    </AsyncBox>
  )
}
