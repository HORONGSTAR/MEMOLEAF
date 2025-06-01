import { NextRequest, NextResponse as NRes } from 'next/server'
import cloudinary, { CloudinaryUploadResponse } from '@/lib/cloudinary'
import prisma from '@/lib/prisma'

interface ImageData {
  id?: number
  url: string
  alt: string
}

export async function POST(request: NextRequest): Promise<NRes> {
  try {
    const { images, id } = await request.json()

    if (!images || !Array.isArray(images)) {
      return NRes.json({ error: '이미지 데이터가 제공되지 않았습니다.' }, { status: 400 })
    }

    const uploadPromises = images.map(async (image: ImageData) => {
      try {
        if (!image.id) {
          const uploadResult = (await cloudinary.uploader.upload(image.url, {
            upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
          })) as CloudinaryUploadResponse
          return { url: uploadResult.public_id, alt: image.alt }
        } else {
          return { url: image.url, alt: image.alt }
        }
      } catch (error) {
        console.error('개별 이미지 업로드 실패:', error)
        return null
      }
    })

    const results = await Promise.all(uploadPromises)

    const successfulUploads = results.filter((result) => result !== null)
    if (successfulUploads.length === 0) {
      return NRes.json({ error: '모든 이미지 업로드에 실패했습니다.' }, { status: 500 })
    }

    await prisma.image
      .createMany({
        data: successfulUploads.map((img) => ({ memoId: id, ...img })),
      })
      .then(() => console.log('됨'))
      .catch((err) => console.error('ㄹㅇ끔찍한 에러' + err))

    return NRes.json({ status: 200 })
  } catch (error) {
    console.error('업로드 중 오류 발생:', error)

    return NRes.json({ error: '이미지 업로드 중 오류가 발생했습니다.' }, { status: 500 })
  }
}
