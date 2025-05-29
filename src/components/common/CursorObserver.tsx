'use client'
import { useEffect, useRef } from 'react'

interface Props {
  loadMoreItems: () => void
}

export default function CursorObserver({ loadMoreItems }: Props) {
  const observerRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          loadMoreItems()
        }
      },
      { threshold: 0.1 }
    )
    if (observerRef.current) {
      observer.observe(observerRef.current)
    }
    return () => observer.disconnect()
  }, [loadMoreItems])

  return <div ref={observerRef} />
}
