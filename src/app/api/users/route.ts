import prisma from '@/lib/prisma'
import { NextRequest, NextResponse as NRes } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import cloudinary, { CloudinaryUploadResponse } from '@/lib/cloudinary'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      const message = '로그인이 필요합니다.'
      return NRes.json({ success: false, message }, { status: 401 })
    }
    const followerId = session.user.id
    const { followingId } = await req.json()
    const search = await prisma.user.count({ where: { id: followingId } })

    if (!search) {
      const message = '유저를 찾을 수 없습니다.'
      return NRes.json({ success: false, message }, { status: 404 })
    }
    const followId = await prisma.follow.create({ data: { followerId, followingId } })
    await prisma.alarm.create({
      data: { link: followerId, sanderId: followerId, recipientId: followingId, aria: 'follow' },
    })

    return NRes.json(followId)
  } catch (error) {
    console.error(error)
    const message = '팔로우 중 문제가 발생했습니다.'
    return NRes.json({ success: false, message }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      const message = '로그인이 필요합니다.'
      return NRes.json({ success: false, message }, { status: 401 })
    }

    const id = session.user.id
    const { name, info, image } = await req.json()

    let imageUrl = null

    if (image) {
      const uploadResult = (await cloudinary.uploader.upload(image, {
        upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
      })) as CloudinaryUploadResponse

      imageUrl = uploadResult.public_id
    }

    const result = await prisma.user.update({ where: { id }, data: { name, info, ...(imageUrl && { image: imageUrl }) } })
    return NRes.json(result)
  } catch (err) {
    console.error(err)
    return NRes.json({ success: false, message: '프로필 수정 중 문제가 발생했습니다.' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      const message = '로그인이 필요합니다.'
      return NRes.json({ success: false, message }, { status: 401 })
    }
    const followerId = session.user.id
    const { followingId } = await req.json()
    const search = await prisma.user.count({ where: { id: followingId } })
    if (!search) {
      const message = '유저를 찾을 수 없습니다.'
      return NRes.json({ success: false, message }, { status: 404 })
    }
    await prisma.follow.delete({
      where: { followerId_followingId: { followerId, followingId } },
    })
    return NRes.json(followingId)
  } catch (error) {
    console.error(error)
    const message = '언팔로우 중 문제가 발생했습니다.'
    return NRes.json({ success: false, message }, { status: 500 })
  }
}
