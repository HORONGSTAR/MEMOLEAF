'use client'
import { getMemoById } from '@/lib/fetch/memoApi'
import { BackButton, MemoBox } from '@/components'
import { useEffect, useState } from 'react'
import { Memo } from '@/lib/types'

export default function MemoDetail({ id }: { id: string }) {
  const [memo, setMemo] = useState<Memo>()
  useEffect(() => {
    getMemoById(id).then((result) => setMemo(result))
  })

  return (
    <>
      <div>
        <BackButton />
      </div>
      {memo && <MemoBox memo={memo} layout="detail" />}
    </>
  )
}
