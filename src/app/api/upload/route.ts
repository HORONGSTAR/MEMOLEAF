import { NextRequest, NextResponse as NRes } from 'next/server'
import cloudinary, { CloudinaryUploadResponse } from '@/lib/cloudinary'
import prisma from '@/lib/prisma'

interface ImageData {
  id?: number
  url: string
  alt: string
}

export async function POST(request: NextRequest): Promise<NRes> {
  const startTime = Date.now()

  try {
    const { images, id } = await request.json()

    if (!images || !Array.isArray(images)) {
      const message = '이미지 데이터가 제공되지 않았습니다.'
      return NRes.json({ success: false, message }, { status: 400 })
    }
    if (!id) {
      const message = 'memoId가 제공되지 않았습니다.'
      return NRes.json({ success: false, message }, { status: 400 })
    }

    const memoIdInt = parseInt(id)
    console.log(`Processing ${images.length} images for memo ${memoIdInt}`)

    const uploadPromises = images.map(async (image: ImageData, index: number) => {
      try {
        await new Promise((resolve) => setTimeout(resolve, index * 100))

        if (!image.id) {
          const uploadResult = (await cloudinary.uploader.upload(image.url, {
            upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
            timeout: 30000,
          })) as CloudinaryUploadResponse
          return { url: uploadResult.public_id, alt: image.alt }
        } else {
          return { url: image.url, alt: image.alt }
        }
      } catch (error) {
        console.error(`이미지 ${index} 업로드 실패:`, error)
        return null
      }
    })

    const results = await Promise.all(uploadPromises)
    const successfulUploads = results.filter((result) => result !== null)

    if (successfulUploads.length === 0) {
      const message = '이미지 업로드에 실패했습니다.'
      return NRes.json({ success: false, message }, { status: 500 })
    }

    console.log(`${successfulUploads.length}/${images.length} 이미지 업로드 성공`)

    try {
      const imageData = successfulUploads.map((img) => ({
        memoId: memoIdInt,
        url: img!.url,
        alt: img!.alt,
      }))

      let createdImages

      try {
        await prisma.image.createMany({
          data: imageData,
          skipDuplicates: true,
        })
        createdImages = imageData
      } catch (createManyError) {
        console.warn('createMany 실패, 개별 생성으로 전환:', createManyError)

        const timeElapsed = Date.now() - startTime
        if (timeElapsed > 8000) {
          throw new Error('처리 시간 초과')
        }

        createdImages = []

        for (const data of imageData) {
          try {
            const created = await prisma.image.create({ data })
            createdImages.push(created)
          } catch (individualError) {
            console.error('개별 이미지 생성 실패:', individualError)
          }
        }
      }

      console.log(`${createdImages.length}개의 이미지 저장 성공.`)

      return NRes.json(
        {
          message: '이미지 업로드 성공',
          count: createdImages.length,
          images: createdImages,
        },
        { status: 200 }
      )
    } catch (dbError) {
      console.error('데이터베이스 저장 실패:', dbError)

      const cleanupPromises = successfulUploads.map(async (img) => {
        try {
          if (img && !img.url.startsWith('http')) {
            await cloudinary.uploader.destroy(img.url)
          }
        } catch (cleanupError) {
          console.error('Cloudinary 이미지 정리 실패:', cleanupError)
        }
      })

      await Promise.allSettled(cleanupPromises)
      const message = '데이터베이스 저장 중 문제가 발생했습니다.'
      return NRes.json({ success: false, message }, { status: 500 })
    }
  } catch (error) {
    console.error('업로드 중 오류 발생:', error)
    const message = '이미지 업로드 중 문제가 발생했습니다.'
    return NRes.json({ success: false, message }, { status: 500 })
  }
}
