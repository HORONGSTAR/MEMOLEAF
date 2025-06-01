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

    // 입력 검증 강화
    if (!images || !Array.isArray(images)) {
      return NRes.json({ error: '이미지 데이터가 제공되지 않았습니다.' }, { status: 400 })
    }

    if (!id) {
      return NRes.json({ error: 'memoId가 제공되지 않았습니다.' }, { status: 400 })
    }

    const memo = await prisma.memo.findUnique({
      where: { id: parseInt(id) },
    })

    if (!memo) {
      return NRes.json({ error: '유효하지 않은 memoId입니다.' }, { status: 400 })
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

    try {
      const imageData = successfulUploads.map((img) => ({
        memoId: parseInt(id),
        url: img!.url,
        alt: img!.alt,
      }))

      let createdImages

      try {
        await prisma.image.createMany({
          data: imageData,
          skipDuplicates: true,
        })

        createdImages = await prisma.image.findMany({
          where: {
            memoId: parseInt(id),
            url: { in: imageData.map((img) => img.url) },
          },
          orderBy: { id: 'desc' },
          take: imageData.length,
        })
      } catch (createManyError) {
        console.warn('createMany 실패, 개별 생성으로 전환:', createManyError)

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

      console.log(`${createdImages.length}개의 이미지가 성공적으로 저장되었습니다.`)

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

      // 업로드된 Cloudinary 이미지들 롤백
      const cleanupPromises = successfulUploads.map(async (img) => {
        try {
          if (img && !img.url.startsWith('http')) {
            // public_id인 경우에만
            await cloudinary.uploader.destroy(img.url)
          }
        } catch (cleanupError) {
          console.error('Cloudinary 이미지 정리 실패:', cleanupError)
        }
      })

      await Promise.allSettled(cleanupPromises)

      return NRes.json(
        {
          error: '데이터베이스 저장 중 오류가 발생했습니다.',
          details: dbError instanceof Error ? dbError.message : '알 수 없는 오류',
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('업로드 중 오류 발생:', error)

    return NRes.json(
      {
        error: '이미지 업로드 중 오류가 발생했습니다.',
        details: error instanceof Error ? error.message : '알 수 없는 오류',
      },
      { status: 500 }
    )
  }
}
