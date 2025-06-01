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
    await prisma.notification.create({
      data: { sanderId: followerId, recipientId: followingId, aria: 'follow' },
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
    const { name, info, note, image, cover } = await req.json()

    let imageUrl = null
    let coverUrl = null

    if (image) {
      const uploadResult = (await cloudinary.uploader.upload(image, {
        upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
      })) as CloudinaryUploadResponse
      imageUrl = uploadResult.public_id
    }

    if (cover) {
      const uploadResult = (await cloudinary.uploader.upload(cover, {
        upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
      })) as CloudinaryUploadResponse
      coverUrl = uploadResult.public_id
    }

    const result = await prisma.user.update({
      where: { id },
      data: {
        name,
        info,
        note,
        ...(imageUrl && { image: imageUrl }),
        ...(coverUrl && { cover: coverUrl }),
      },
    })
    return NRes.json(result)
  } catch (error) {
    console.error(error)
    const message = '프로필 수정 중 문제가 발생했습니다.'
    return NRes.json({ success: false, message }, { status: 500 })
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
