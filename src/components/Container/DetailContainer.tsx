'use client'
import { Button, Chip, Container, ListItem, ListItemText, Paper, Skeleton, useTheme } from '@mui/material'
import { ReactNode, useCallback, useMemo, useState } from 'react'
import { MemoBox, MemoForm, MemoList, ThreadBox } from '@/components/memo'
import { createMemo, updateMemo } from '@/shared/fetch/memosApi'
import { MemoData, LeafData } from '@/shared/types/client'
import { useAppSelector } from '@/store/hooks'
import { checkOnOff } from '@/shared/utils/common'
import { MemoParams } from '@/shared/types/api'
import { useRouter } from 'next/navigation'

interface Props {
  myId?: number
  firstLoadParent: MemoData
  children: ReactNode
}

export default function DetailContainer(props: Props) {
  const { firstLoadParent, myId, children } = props
  const { profile } = useAppSelector((state) => state.profile)
  const [parent, setParent] = useState<MemoData>(firstLoadParent)
  const [leafs, setLeafs] = useState<LeafData[]>([])
  const [editId, setEdit] = useState(0)
  const router = useRouter()
  const theme = useTheme()
  const isMine = checkOnOff(parent.user.id, myId || 0)

  const addMemoList = useCallback((values: LeafData[]) => {
    setLeafs((prev) => [...prev, ...values])
  }, [])

  const handleCreateMemo = useCallback(
    (params: MemoParams) => {
      if (!profile) return
      createMemo(params)
        .then((result) =>
          setLeafs((prev) => {
            return [...prev, { ...result, user: profile, bookmarks: [] }]
          })
        )
        .catch()
        .finally()
    },
    [profile]
  )

  const handleUpdateLeaf = useCallback(
    (params: MemoParams) => {
      if (!profile) return
      updateMemo(params)
        .then((result) =>
          setLeafs((prev) =>
            prev.map((p) => {
              return p.id !== editId ? p : { ...p, ...result }
            })
          )
        )
        .catch()
        .finally(() => setEdit(0))
    },
    [editId, profile]
  )

  const handleUpdateParent = useCallback(
    (params: MemoParams) => {
      if (!profile) return
      setEdit(0)
      updateMemo(params)
        .then((result) => setParent((prev) => ({ ...prev, ...result })))
        .catch()
    },
    [profile]
  )

  const threadTotalDigit = useMemo(() => (parent._count?.leafs.toString().length || 0) + 1, [parent._count?.leafs])

  const ThreadItem = ({ leaf, index }: { leaf: LeafData; index: number }) => {
    const item = (
      <ThreadBox
        memo={leaf}
        isMine={isMine}
        removeItem={() => setLeafs((prev) => prev.filter((p) => p.id !== leaf.id))}
        editItem={() => setEdit(leaf.id)}
      >
        <Chip size="small" label={(index + 1).toString().padStart(threadTotalDigit, '0')} />
      </ThreadBox>
    )
    const editform = (
      <MemoForm action="update" {...leaf} onSubmint={handleUpdateLeaf}>
        <Button color="error" onClick={() => setEdit(0)}>
          취소
        </Button>
      </MemoForm>
    )
    return { [leaf.id]: item, [editId]: editform }[leaf.id]
  }

  const ParentBox = () => {
    const item = <MemoBox memo={parent} myId={myId} removeItem={() => router.push('/')} editItem={() => setEdit(parent.id)} />
    const editform = (
      <MemoForm action="update" {...parent} onSubmint={handleUpdateParent}>
        <Button color="error" onClick={() => setEdit(0)}>
          취소
        </Button>
      </MemoForm>
    )
    return { [parent.id]: item, [editId]: editform }[parent.id]
  }

  const loadleafsLength = useMemo(() => Array((parent._count?.leafs || leafs.length) - leafs.length).fill(0), [leafs.length, parent._count?.leafs])

  const loadingBox = loadleafsLength.map((_, i) => (
    <ListItem key={'threadLoading' + i} dense>
      <ListItemText primary={<Skeleton />} secondary={<Skeleton />} />
    </ListItem>
  ))

  return (
    <Container sx={{ mb: 4, minHeight: '100vh' }}>
      <div>{children}</div>
      <ParentBox />
      <MemoList loadingBox={loadingBox} addMemoList={addMemoList} id={parent.id} aria={'thread'} nextCursor={0}>
        {leafs.map((leaf: LeafData, index) => (
          <ThreadItem key={'detail-memo' + leaf.id} leaf={leaf} index={index} />
        ))}
      </MemoList>
      <Paper variant="outlined" sx={{ bgcolor: theme.palette.secondary.light, p: 1 }}>
        <MemoForm action="create" parentId={parent.id} onSubmint={handleCreateMemo} />
      </Paper>
    </Container>
  )
}
