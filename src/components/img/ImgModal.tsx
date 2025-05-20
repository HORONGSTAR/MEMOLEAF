'use client'
import { useState } from 'react'
import { BasicProps } from '@/lib/types'
import Image from 'next/image'
import { Dialog } from '@/components'
import { swapOnOff } from '@/lib/utills'

interface Props extends BasicProps {
  size?: number
  alt?: string
}

export default function ImgModalBox(props: Props) {
  const { image, alt, size } = props
  const [open, setOpen] = useState('off')

  return (
    <>
      <Image
        onClick={() => setOpen('on')}
        tabIndex={0}
        src={`${image}`}
        alt={`${alt} 이미지`}
        width={size || 150}
        height={size || 150}
        style={{ aspectRatio: 1 / 1, objectFit: 'cover', borderRadius: 2 }}
      />

      {open && (
        <Dialog title="이미지 상세보기" closeLabel="닫기" open={swapOnOff[open].bool} onClose={() => setOpen('off')}>
          <Image src={`${image}`} alt={`${alt}`} width={600} height={600} />
          {alt}
        </Dialog>
      )}
    </>
  )
}
