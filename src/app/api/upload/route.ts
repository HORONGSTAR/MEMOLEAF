import { NextRequest, NextResponse as NRes } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

interface CloudinaryUploadResponse {
  secure_url: string
  public_id: string
  format: string
  width: number
  height: number
  resource_type: string
  created_at: string
  bytes: number
}

interface UploadResult {
  url: string
  public_id: string
  width: number
  height: number
}

export async function POST(request: NextRequest): Promise<NRes> {
  try {
    // 요청 본문 확인
    const body = await request.json()

    if (!body || !body.images || !Array.isArray(body.images) || body.images.length === 0) {
      return NRes.json({ error: '이미지 데이터가 제공되지 않았습니다.' }, { status: 400 })
    }

    const imagesData = body.images

    const uploadPromises = imagesData.map(async (imageData: string) => {
      try {
        const uploadResult = (await cloudinary.uploader.upload(imageData, {
          upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
        })) as CloudinaryUploadResponse

        console.log(uploadResult.public_id)

        return uploadResult.public_id
      } catch (error) {
        console.error('개별 이미지 업로드 실패:', error)
        return null
      }
    })

    const results = await Promise.all(uploadPromises)

    const successfulUploads = results.filter((result): result is UploadResult => result !== null)

    if (successfulUploads.length === 0) {
      return NRes.json({ error: '모든 이미지 업로드에 실패했습니다.' }, { status: 500 })
    }

    return NRes.json(
      {
        message: `${successfulUploads.length}개의 이미지가 성공적으로 업로드되었습니다.`,
        failed: results.length - successfulUploads.length,
        uploads: successfulUploads,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('업로드 중 오류 발생:', error)

    return NRes.json({ error: '이미지 업로드 중 오류가 발생했습니다.' }, { status: 500 })
  }
}
