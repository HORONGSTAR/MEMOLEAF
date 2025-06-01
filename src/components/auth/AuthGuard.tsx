'use client'
import { useRouter } from 'next/navigation'
import { ReactNode, useEffect } from 'react'

interface Props {
  myId?: number
  children: ReactNode
}

export default function AuthGuard({ myId, children }: Props) {
  const router = useRouter()

  useEffect(() => {
    if (myId) return
    router.push('/')
  }, [myId, router])

  return children
}
