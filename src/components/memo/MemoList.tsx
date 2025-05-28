'use client'
import { ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import { fetchMemos } from '@/shared/fetch/memosApi'
import { swapOnOff } from '@/shared/utils/common'
import { MemoData } from '@/shared/types/client'
import { Stack } from '@mui/material'
import { MemosAria } from '@/shared/types/api'

interface Props {
  query: {
    aria: MemosAria
    id?: number
    keyword?: string
    filter?: string
  }
  nextCursor?: number
  children: ReactNode
  loadingBox: ReactNode
  addMemoList: (values: MemoData[]) => void
}

export default function MemoList(props: Props) {
  const { nextCursor, query, children, loadingBox, addMemoList } = props
  const [cursor, setCursor] = useState<undefined | number>(nextCursor)
  const [loading, setLoading] = useState('off')
  const isSameAria = useRef(JSON.stringify(query))
  const observerRef = useRef(null)

  useEffect(() => {
    if (isSameAria.current !== JSON.stringify(query)) {
      setCursor(nextCursor)
      isSameAria.current = JSON.stringify(query)
    }
  }, [isSameAria, query, nextCursor])

  const loadMoreMemos = useCallback(() => {
    if (cursor && cursor < 0) return
    setLoading('on')
    fetchMemos({ query: { ...query, cursor } })
      .then((result) => {
        addMemoList(result.memos)
        setCursor(result.nextCursor)
      })
      .catch()
      .finally(() => setLoading('off'))
  }, [cursor, query, addMemoList])

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
