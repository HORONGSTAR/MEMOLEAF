'use client'
import { useState } from 'react'
import { BasicProps } from '@/lib/types'
import Image from 'next/image'

interface Props extends BasicProps {
  size?: number
}

export default function ImgModalBox(props: Props) {
  const { image, label, size } = props
  const [open, setOpen] = useState(false)

  return (
    <>
      <Image
        onClick={(e) => {
          e.stopPropagation()
          setOpen(true)
        }}
        src={`${image}`}
        alt={`${label}`}
        width={size || 150}
        height={size || 150}
        className="aspect-square object-cover rounded-md cursor-pointer"
      />
      {open && (
        <div
          className="image-modal"
          onClick={(e) => {
            e.stopPropagation()
            setOpen(false)
          }}
        >
          <Image src={`${image}`} alt={`${label}`} width={600} height={600} />
        </div>
      )}
    </>
  )
}
