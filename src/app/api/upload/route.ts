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
  console.log('🚀 이미지 업로드 API 시작')

  try {
    const { images, id } = await request.json()
    console.log('📥 요청 데이터:', {
      imagesCount: images?.length,
      id,
      idType: typeof id,
    })

    // 입력 검증
    if (!images || !Array.isArray(images)) {
      console.log('❌ 이미지 데이터 없음')
      return NRes.json(
        {
          success: false,
          message: '이미지 데이터가 제공되지 않았습니다.',
        },
        { status: 400 }
      )
    }

    if (!id) {
      console.log('❌ memoId 없음')
      return NRes.json(
        {
          success: false,
          message: 'memoId가 제공되지 않았습니다.',
        },
        { status: 400 }
      )
    }

    const memoIdInt = parseInt(id)
    console.log(`📝 Processing ${images.length} images for memo ${memoIdInt}`)

    // 1. Cloudinary 업로드 단계
    console.log('☁️ Cloudinary 업로드 시작')
    const uploadPromises = images.map(async (image: ImageData, index: number) => {
      try {
        // 순차 업로드를 위한 딜레이
        await new Promise((resolve) => setTimeout(resolve, index * 100))

        if (!image.id) {
          console.log(`☁️ 이미지 ${index + 1}/${images.length} 업로드 중...`)
          const uploadResult = (await cloudinary.uploader.upload(image.url, {
            upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
            timeout: 30000,
          })) as CloudinaryUploadResponse

          console.log(`✅ 이미지 ${index + 1} 업로드 성공: ${uploadResult.public_id}`)
          return { url: uploadResult.public_id, alt: image.alt }
        } else {
          console.log(`♻️ 이미지 ${index + 1} 기존 이미지 재사용`)
          return { url: image.url, alt: image.alt }
        }
      } catch (error) {
        console.error(`❌ 이미지 ${index + 1} 업로드 실패:`, error)
        return null
      }
    })

    const results = await Promise.all(uploadPromises)
    const successfulUploads = results.filter((result) => result !== null)

    console.log(`📊 Cloudinary 업로드 완료: ${successfulUploads.length}/${images.length} 성공`)

    if (successfulUploads.length === 0) {
      console.log('❌ 모든 이미지 업로드 실패')
      return NRes.json(
        {
          success: false,
          message: '이미지 업로드에 실패했습니다.',
        },
        { status: 500 }
      )
    }

    // 2. 데이터베이스 개별 저장 단계
    console.log('💾 데이터베이스 개별 저장 시작')
    const createdImages = []
    const failedImages = []

    for (const [index, imageData] of successfulUploads.entries()) {
      if (!imageData) continue

      const data = {
        memoId: memoIdInt,
        url: imageData.url,
        alt: imageData.alt,
      }

      try {
        console.log(`💾 DB 저장 ${index + 1}/${successfulUploads.length}: ${data.url}`)
        const created = await prisma.image.create({ data })
        createdImages.push(created)
        console.log(`✅ DB 저장 ${index + 1} 성공 (ID: ${created.id})`)
      } catch (error) {
        console.error(`❌ DB 저장 ${index + 1} 실패:`, { error })
        failedImages.push({ imageData, error })
      }

      // 서버리스 환경에서 안정성을 위한 작은 딜레이
      if (index < successfulUploads.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 50))
      }
    }

    console.log(`🎉 최종 결과: ${createdImages.length}/${successfulUploads.length} DB 저장 성공`)

    // 실패한 이미지들 Cloudinary에서 정리
    if (failedImages.length > 0) {
      console.log(`🧹 실패한 이미지 ${failedImages.length}개 Cloudinary 정리 시작`)

      const cleanupPromises = failedImages.map(async ({ imageData }, index) => {
        try {
          if (!imageData.url.startsWith('http')) {
            await cloudinary.uploader.destroy(imageData.url)
            console.log(`✅ 정리 완료 ${index + 1}: ${imageData.url}`)
          }
        } catch (error) {
          console.error(`❌ 정리 실패 ${index + 1}:`, error)
        }
      })

      await Promise.allSettled(cleanupPromises)
    }

    // 최종 성공 체크
    if (createdImages.length === 0) {
      return NRes.json(
        {
          success: false,
          message: '데이터베이스 저장에 모두 실패했습니다.',
        },
        { status: 500 }
      )
    }

    const totalTime = Date.now() - startTime
    console.log(`⏱️ 전체 처리 시간: ${totalTime}ms`)

    return NRes.json(
      {
        success: true,
        message: `${createdImages.length}개의 이미지가 성공적으로 업로드되었습니다.`,
        count: createdImages.length,
        images: createdImages,
        ...(failedImages.length > 0 && {
          warning: `${failedImages.length}개의 이미지 저장에 실패했습니다.`,
        }),
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('💥 전체 프로세스 오류:', error)

    return NRes.json(
      {
        success: false,
        message: '이미지 업로드 중 예상치 못한 오류가 발생했습니다.',
      },
      { status: 500 }
    )
  }
}
