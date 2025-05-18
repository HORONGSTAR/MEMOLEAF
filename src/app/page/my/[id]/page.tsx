import { MyProfile, MyPost, MemoList } from '@/components'
import { Typography, Stack } from '@mui/material'
import { Error } from '@mui/icons-material'
import prisma, { disconnectPrisma } from '@/lib/prisma'

export default async function MyPage({ params }: { params: Promise<{ id: string }> }) {
  disconnectPrisma()

  const { id } = await params
  const profile = await prisma.user.findUnique({
    where: { id: parseInt(id) },
    select: { id: true, name: true, image: true, info: true, userNum: true, _count: { select: { fromUsers: true, toUsers: true } } },
  })

  const memos = await prisma.memo.findMany({
    take: 10,
    where: { parentId: null, userId: parseInt(id) },
    orderBy: { createdAt: 'desc' },
    include: { user: true, images: true, decos: true, _count: { select: { comments: true, bookmarks: true, leafs: true } } },
  })

  return (
    <>
      {profile ? (
        <>
          <MyProfile {...profile} />
          <MyPost>
            <MemoList />
          </MyPost>
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
