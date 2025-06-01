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

    // 입력 검증
    if (!images || !Array.isArray(images)) {
      return NRes.json({ error: '이미지 데이터가 제공되지 않았습니다.' }, { status: 400 })
    }

    if (!id) {
      return NRes.json({ error: 'memoId가 제공되지 않았습니다.' }, { status: 400 })
    }

    // 서버리스 환경: 이미지 개수 제한 (타임아웃 방지)
    if (images.length > 10) {
      return NRes.json({ error: '한 번에 최대 10개의 이미지만 업로드할 수 있습니다.' }, { status: 400 })
    }

    const memoIdInt = parseInt(id)
    console.log(`Processing ${images.length} images for memo ${memoIdInt}`)

    // Cloudinary 업로드 (병렬 처리하되 제한적으로)
    const uploadPromises = images.map(async (image: ImageData, index: number) => {
      try {
        // 서버리스에서는 순차적으로 처리하는 것이 더 안정적
        await new Promise((resolve) => setTimeout(resolve, index * 100)) // 100ms씩 지연

        if (!image.id) {
          const uploadResult = (await cloudinary.uploader.upload(image.url, {
            upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
            timeout: 30000, // 30초 타임아웃
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
      return NRes.json({ error: '모든 이미지 업로드에 실패했습니다.' }, { status: 500 })
    }

    console.log(`${successfulUploads.length}/${images.length} 이미지 업로드 성공`)

    // 연결풀 절약을 위한 개선된 방법 (서버리스 최적화)
    try {
      const imageData = successfulUploads.map((img) => ({
        memoId: memoIdInt,
        url: img!.url,
        alt: img!.alt,
      }))

      let createdImages

      // 서버리스: 간단하고 빠른 방식 우선
      try {
        await prisma.image.createMany({
          data: imageData,
          skipDuplicates: true,
        })

        // 생성 확인을 위한 조회 (선택적)
        createdImages = imageData // 간소화: 실제 DB 조회 생략
      } catch (createManyError) {
        console.warn('createMany 실패, 개별 생성으로 전환:', createManyError)

        // 서버리스에서는 타임아웃을 피하기 위해 빠르게 포기
        const timeElapsed = Date.now() - startTime
        if (timeElapsed > 8000) {
          // 8초 경과시 포기
          throw new Error('처리 시간 초과')
        }

        // 개별 생성 (최대 5개까지만)
        createdImages = []
        const limitedData = imageData.slice(0, 5)

        for (const data of limitedData) {
          try {
            const created = await prisma.image.create({ data })
            createdImages.push(created)
          } catch (individualError) {
            console.error('개별 이미지 생성 실패:', individualError)
            // 서버리스에서는 빠르게 넘어감
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
