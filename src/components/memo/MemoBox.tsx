'use client'
import { ReactNode, useCallback, useMemo, useState } from 'react'
import { ImgGrid } from '@/components/img'
import { BookmarkButton, CommentButton } from '@/components/feedback'
import { Avatar, Menu, Dialog, LinkBox } from '@/components/common'
import { MoreHoriz, DeleteOutline, EditOutlined, LinkOutlined, AutoStoriesOutlined } from '@mui/icons-material'
import { Snackbar, Typography, Button, ListItem, ListItemAvatar, ListItemText, Box } from '@mui/material'
import { MemoData, Layout, MemoParams, EditDeco, OnOffItem, UserData, OnOff } from '@/lib/types'
import { addImagePath, checkCurrentOnOff, changeDate } from '@/lib/utills'
import { useSession } from 'next-auth/react'
import { deleteMemo, updateMemo } from '@/lib/fetch/memoApi'
import { MemoForm } from '.'
import DecoBox from './DecoBox'
import Link from 'next/link'
import { grey } from '@mui/material/colors'

interface Props {
  memo: MemoData
  layout: Layout
  user?: UserData
  thread: ReactNode
}

export default function MemoBox(props: Props) {
  const { layout, thread } = props
  const [memo, setMemo] = useState(props.memo)
  const [action, setAction] = useState('view')
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const { data: session } = useSession()
  const myId = session?.user.id
  const isMine = checkCurrentOnOff(memo.userId, myId || 0)

  const onSubmit = useCallback(
    (params: Omit<MemoParams, 'id'>) => {
      updateMemo({ ...params, id: memo.id })
        .then((result) => setMemo((prev) => ({ ...prev, ...result })))
        .catch()
      setAction('view')
    },
    [memo]
  )

  const handleDelete = useCallback(() => {
    deleteMemo(memo.id)
    setAction('remove')
    setOpen(false)
  }, [memo])

  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      return '링크를 클립보드에 복사했습니다.'
    } catch (err) {
      console.error('복사 실패:', err)
      return '링크 복사하는 중 문제가 발생했습니다.'
    }
  }

  const handleCopy = useCallback(async () => {
    const url = `${window.location.origin}/page/detail/${memo.id}`
    const reuslt = copyText(url)
    setMessage(await reuslt)
  }, [memo])

  const decos: EditDeco = {}
  memo.decos.forEach((deco) => (decos[deco.kind] = { active: 'on', extra: deco.extra }))
  const editProps = { ...memo, onSubmit, decos, placeholder: '메모 내용 수정하기' }

  const dialogProps = {
    open,
    title: '메모를 삭제할까요?',
    closeLabel: '취소',
    actionLabel: '삭제',
    onClose: () => setOpen(false),
    onAction: handleDelete,
  }

  const memu = (
    <Menu
      icon={<MoreHoriz fontSize="small" />}
      label="더 보기"
      items={[
        { active: isMine, label: '글 수정', icon: <EditOutlined />, onClick: () => setAction('edit') },
        { active: isMine, label: '삭제', icon: <DeleteOutline />, onClick: () => setOpen(true) },
        { active: 'on', label: '공유하기', icon: <LinkOutlined />, onClick: () => handleCopy() },
      ]}
    />
  )

  const bookmarkProps = useMemo(() => {
    if (!memo.bookmarks) return { id: memo.id, state: 'uncheck' }
    const isMyBookmark = checkCurrentOnOff(1, memo.bookmarks.length)
    const id: { [key: OnOff]: number } = { on: memo.bookmarks[0]?.id, off: memo.id }
    const state: { [key: OnOff]: string } = { on: 'check', off: 'uncheck' }
    return { id: id[isMyBookmark], state: state[isMyBookmark] }
  }, [memo])

  const memoStateBox: OnOffItem = {
    view: (
      <Box sx={{ p: 1 }}>
        <ListItem secondaryAction={memu}>
          <ListItemAvatar>
            <LinkBox link={`/page/my/${memo.user.id}`}>
              <Avatar user={memo.user} size={36} />
            </LinkBox>
          </ListItemAvatar>
          <ListItemText primary={<LinkBox link={`/page/my/${memo.userId}`}>{memo.user?.name}</LinkBox>} secondary={changeDate(memo.createdAt)} />
        </ListItem>
        <DecoBox decos={memo.decos}>
          <ListItem>{memo.content}</ListItem>
          <ListItem disablePadding>
            <ImgGrid layout={layout} images={addImagePath(memo.images)} />
          </ListItem>
        </DecoBox>
        <ListItem>
          <Button
            component={Link}
            href={`/page/detail/${memo.id}`}
            sx={{
              borderRadius: 20,
              minWidth: 40,
              minHeight: 40,
              px: 1.5,
              whiteSpace: 'nowrap',
              '& .label': { opacity: 0, width: 0, transition: 'all 0.2s ease' },
              '&:hover .label': { opacity: 1, width: 'auto', marginLeft: 1 },
            }}
          >
            <AutoStoriesOutlined fontSize="small" />
            <span className="label">페이지</span>
          </Button>
          <Box flexGrow={1} />
          <BookmarkButton {...bookmarkProps} count={memo._count?.bookmarks} />
          <CommentButton id={memo.id} count={memo._count?.comments} />
        </ListItem>
        {thread}
      </Box>
    ),
    edit: (
      <Box sx={{ bgcolor: grey[100], p: 1 }}>
        <MemoForm {...editProps}>
          <Button color="error" onClick={() => setAction('view')}>
            취소
          </Button>
        </MemoForm>
      </Box>
    ),
    remove: (
      <Box sx={{ bgcolor: grey[100], p: 1 }}>
        <Typography color="textDisabled">삭제된 메모입니다.</Typography>
      </Box>
    ),
  }

  return (
    <>
      {memoStateBox[action]}
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={message ? true : false}
        autoHideDuration={6000}
        onClose={() => setMessage('')}
        message={message}
      />
      <Dialog {...dialogProps}>
        <Typography>삭제한 메모는 복구할 수 없습니다.</Typography>
      </Dialog>
    </>
  )
}
