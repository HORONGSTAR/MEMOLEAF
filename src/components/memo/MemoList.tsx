'use client'
import { ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import { fetchMemos } from '@/shared/fetch/memosApi'
import { swapOnOff } from '@/shared/utils/common'
import { MemoData } from '@/shared/types/client'
import { Stack } from '@mui/material'

interface Props {
  aria: 'home' | 'mypost' | 'bookmark' | 'thread'
  id?: number
  nextCursor: number
  children: ReactNode
  loadingBox: ReactNode
  addMemoList: (values: MemoData[]) => void
}

export default function MemoList(props: Props) {
  const { aria, nextCursor, children, id, loadingBox, addMemoList } = props
  const [cursor, setCursor] = useState(nextCursor)
  const [loading, setLoading] = useState('off')
  const observerRef = useRef(null)

  const loadMoreMemos = useCallback(() => {
    if (cursor < 0) return
    setLoading('on')
    fetchMemos({ query: { aria, cursor, id } })
      .then((result) => {
        addMemoList(result.memos)
        setCursor(result.nextCursor)
      })
      .catch()
      .finally(() => setLoading('off'))
  }, [cursor, aria, id, addMemoList])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !swapOnOff[loading].bool) {
          loadMoreMemos()
        }
      },
      { threshold: 0.1 }
    )
    if (observerRef.current) {
      observer.observe(observerRef.current)
    }
    return () => observer.disconnect()
  }, [loadMoreMemos, loading])

  return (
    <>
      <Stack spacing={2}>{children}</Stack>
      <div ref={observerRef} />
      {{ on: loadingBox, off: null }[loading]}
    </>
  )
}
