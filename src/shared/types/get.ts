import { Prisma } from '@prisma/client'

export type MemoWithRelations = Prisma.MemoGetPayload<{
  include: {
    images: { select: { id: true; url: true; alt: true } }
    decos: { select: { id: true; kind: true; extra: true } }
    user: { select: { id: true; name: true; image: true; userNum: true } }
    bookmarks: { where: { userId: number }; select: { id: true } }
    favorites: { where: { userId: number }; select: { id: true } }
    _count: { select: { favorites: true; bookmarks: true; leafs: true } }
  }
}>

export type NotificationWithRelations = Prisma.NotificationGetPayload<{
  include: {
    sander: { select: { id: true; name: true; image: true; info: true } }
    memo: { select: { id: true; content: true } }
  }
}>

export type FollowerWithRelations = Prisma.FollowGetPayload<{
  include: {
    follower: { select: { id: true; name: true; image: true; info: true; userNum: true } }
  }
}>

export type FollowingWithRelations = Prisma.FollowGetPayload<{
  include: {
    following: { select: { id: true; name: true; image: true; info: true; userNum: true } }
  }
}>
