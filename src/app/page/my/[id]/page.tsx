import { MyProfile, MyPost } from '@/components/user'
import { Typography, Stack } from '@mui/material'
import { Error } from '@mui/icons-material'
import prisma, { disconnectPrisma } from '@/lib/prisma'

export default async function MyPage({ params }: { params: Promise<{ id: string }> }) {
  disconnectPrisma()
  const { id } = await params
  const profile = await prisma.user.findUnique({
    where: { id: parseInt(id) },
    select: {
      id: true,
      name: true,
      image: true,
      info: true,
      userNum: true,
      toUsers: true,
    },
  })

  const lastMyMemo = await prisma.memo.findFirst({
    where: { userId: parseInt(id) },
    take: 1,
    select: { id: true },
    orderBy: { createdAt: 'desc' },
  })

  const lastBookmark = await prisma.bookMark.findFirst({
    where: { userId: parseInt(id) },
    take: 1,
    orderBy: { createdAt: 'desc' },
    include: { memo: { select: { id: true } } },
  })

  return (
    <>
      {profile ? (
        <>
          <MyProfile {...profile} />
          <MyPost lastMyMemoId={lastMyMemo?.id || 0} lastBookmarkId={lastBookmark?.memo?.id || 0} id={parseInt(id)} name={profile.name} />
        </>
      ) : (
        <Stack alignItems="center" spacing={2} pt={3}>
          <Stack alignItems="center" sx={{ bgcolor: '#eee', p: 2, borderRadius: 3 }}>
            <Error color="warning" sx={{ mb: 1 }} fontSize="large" />
            <Typography color="textSecondary">존재하지 않는 페이지입니다.</Typography>
          </Stack>
        </Stack>
      )}
    </>
  )
}
