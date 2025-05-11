'use client'
import { Memo } from '@/lib/types'
import { BackButton, MemoBox, MemoDeco, ImgModal } from '@/components'
import { ImageList, ImageListItem } from '@mui/material'
import { useState } from 'react'
import { editImageUrl } from '@/lib/utills'

interface Props {
  memo: Memo
}
export default function MemoDetail(props: Props) {
  const [memo, setMemo] = useState(props.memo)
  const images = editImageUrl(memo.images)
  const count = memo.images.length
  const cols: { [key: number]: number } = { 1: 2, 2: 4, 3: 3, 4: 2 }
  return (
    <>
      <div>
        <BackButton />
      </div>
      <MemoBox {...memo} setMemo={setMemo}>
        <MemoDeco decos={memo.decos}>
          {memo.content}
          <ImageList cols={cols[count]}>
            {images.slice(0, 4 - count).map((img) => (
              <ImageListItem key={img.id} cols={2} rows={2}>
                <ImgModal image={img.url} size={700} />
              </ImageListItem>
            ))}
            {images.slice(4 - count, count).map((img) => (
              <ImageListItem key={img.id}>
                <ImgModal image={img.url} size={700} />
              </ImageListItem>
            ))}
          </ImageList>
        </MemoDeco>
      </MemoBox>
    </>
  )
}
