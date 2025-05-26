'use client'
import { Typography, List, ListItem, Box, ListItemText, Button, Divider, Snackbar } from '@mui/material'
import { deleteAllMemos, deleteUserAccount } from '@/shared/fetch/settingsApi'
import { useCallback, useState } from 'react'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Dialog } from '@/components/common'

export default function SettingContainer() {
  const [open1, setOpen1] = useState(false)
  const [open2, setOpen2] = useState(false)
  const [aria, setAria] = useState('account')
  const { data: session } = useSession()
  const [message, setMessage] = useState('')

  const router = useRouter()
  const myId = session?.user.id

  const handleDelete = useCallback(() => {
    if (!myId) return
    if (aria === 'allmemo')
      deleteAllMemos(myId)
        .then(() => {
          setOpen1(false)
          setOpen2(true)
        })
        .catch(() => setMessage('메모 삭제 중 문제가 발생했습니다.'))
    if (aria === 'account')
      deleteUserAccount(myId)
        .then(() => {
          setOpen1(false)
          setOpen2(true)
        })
        .catch(() => setMessage('계정 삭제 중 문제가 발생했습니다.'))
  }, [aria, myId])

  const handleRedirect = useCallback(() => {
    if (!myId) return
    if (aria === 'allmemo') setOpen2(false)
    if (aria === 'account') {
      signOut()
      return router.push('/')
    }
  }, [aria, myId, router])

  if (!myId) {
    router.push('/')
    return null
  }

  return (
    <>
      <List>
        <ListItem>
          <Typography variant="h5">설정</Typography>
        </ListItem>
        <ListItem>
          <ListItemText
            primary={
              <Typography color="error" variant="subtitle1">
                내 모든 메모 삭제하기
              </Typography>
            }
            secondary={
              <Typography variant="body2" id="remove-info1">
                삭제한 메모는 복구할 수 없습니다. 중요한 메모는 다른 곳에 백업하고 실행해주세요.
              </Typography>
            }
          />
        </ListItem>
        <ListItem>
          <Box>
            <Button
              color="error"
              variant="contained"
              aria-describedby="remove-info1"
              onClick={() => {
                setAria('allmemo')
                setOpen1(true)
              }}
            >
              메모 전체 삭제
            </Button>
          </Box>
        </ListItem>
        <Divider sx={{ py: 1 }} />
        <ListItem>
          <ListItemText
            primary={
              <Typography color="error" variant="subtitle1">
                내 계정 삭제하기
              </Typography>
            }
            secondary={
              <Typography variant="body2" id="remove-info2">
                계정을 삭제하면 데이터도 함께 삭제됩니다. 삭제한 계정과 데이터는 복구 할 수 없습니다.
              </Typography>
            }
          />
        </ListItem>
        <ListItem>
          <Box>
            <Button
              onClick={() => {
                setAria('account')
                setOpen1(true)
              }}
              variant="contained"
              color="error"
              aria-describedby="remove-info2"
            >
              내 계정 삭제
            </Button>
          </Box>
        </ListItem>
      </List>
      <Dialog
        open={open1}
        onClose={() => setOpen1(false)}
        closeLabel="취소"
        actionLabel="삭제"
        title={{ account: '내 계정 삭제', allmemo: '내 모든 메모 삭제' }[aria] || ''}
        onAction={handleDelete}
      >
        <Typography>정말로 삭제할까요?</Typography>
      </Dialog>
      <Dialog open={open2} title={'삭제 완료'} actionLabel="확인" onAction={handleRedirect}>
        {{ account: '계정 삭제를 마쳤습니다.', allmemo: '모든 메모를 삭제했습니다.' }[aria] || ''}
      </Dialog>
      <Snackbar open={message ? true : false} autoHideDuration={6000} onClose={() => setMessage('')} message={message} />
    </>
  )
}
