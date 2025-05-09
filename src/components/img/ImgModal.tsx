'use client'
import { useState } from 'react'
import { BasicProps } from '@/lib/types'
import Image from 'next/image'

export default function ImgModalBox(props: BasicProps) {
  const { image, label } = props
  const [open, setOpen] = useState(false)

  return (
    <>
      <Image
        onClick={() => setOpen(true)}
        src={`${image}`}
        alt={`${label}`}
        fill
        sizes="(max-width: 600px) 100vw, 50vw"
        className="aspect-square object-cover rounded-md cursor-pointer"
      />
      {open && (
        <div className="image-modal" onClick={() => setOpen(false)}>
          <Image src={`${image}`} alt={`${label}`} width={600} height={600} />
        </div>
      )}
    </>
  )
}
