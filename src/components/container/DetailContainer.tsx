'use client'
import { Snackbar, Typography } from '@mui/material'
import { ReactNode, useState } from 'react'
import { MemoData, UserData } from '@/shared/types/client'
import MemoBox from '@/components/memo/MemoBox'
import MemoEditForm from '../memo/MemoEditForm'
import LeafList from '../memo/LeafList'
import TabBox from '../common/TabBox'
import { UserBox, UserList } from '../user'
import LeafCreateForm from '../memo/LeafCreateForm'

interface Props {
  myId: number
  firstLoadMemo: MemoData
  children: ReactNode
  updateItem?: (memo: MemoData) => void
  removeItem?: (itemId: number) => void
}

export default function DetailContainer(props: Props) {
  const { firstLoadMemo, myId, children, updateItem, removeItem } = props
  const [memo, setMemo] = useState<MemoData>(firstLoadMemo)
  const [users, setUsers] = useState<UserData[]>([])
  const [message, setMessage] = useState('')
  const [box, setBox] = useState('item')
  const [filter, setFilter] = useState('new')
  const [cursor, setCursor] = useState<undefined | number>(undefined)
  const [leafs, setLeafs] = useState<MemoData[]>([])
  const count = memo._count

  const updateDetail = (item: MemoData) => {
    setMemo((prev) => ({ ...prev, ...item }))
    if (updateItem) updateItem(item)
  }

  const addUserList = (values: UserData[]) => {
    setUsers((prev) => [...prev, ...values])
  }

  const TitleBox = () => {
    const edit = () => setBox('edit')
    const remove = () => (removeItem ? removeItem(memo.id) : setBox('empty'))
    const actions = { close: () => setBox('item'), alert: (text: string) => setMessage(text) }
    const item = <MemoBox {...{ memo, myId, remove, edit, updateItem: updateDetail }} />
    const form = <MemoEditForm {...{ memo }} {...actions} updateItem={updateDetail} />
    const empty = (
      <Typography variant="body2" color="textDisabled" height={80} align="center">
        삭제된 게시글 입니다.
      </Typography>
    )
    return { item, form, empty }[box]
  }

  const query = { cursor, aria: 'thread', filter, id: memo.id }

  const panels = [
    {
      label: '글쓰기',
      panel: <LeafCreateForm {...{ myId, memo, updateItem: updateDetail }} />,
      categorys: [],
    },
    {
      label: '타래 목록',
      panel: {
        [count.leafs]: <LeafList {...{ myId, leafs, query, setLeafs, setCursor }} />,
        0: null,
      }[count.leafs],
      categorys: [
        { label: `${memo.user.name}님의 글`, value: 'serial' },
        { label: '댓글', value: 'comment' },
      ],
      select: (category: string) => {
        setFilter(category)
      },
    },
    {
      label: '좋아요',
      panel: {
        [count.favorites]: (
          <UserList {...{ endpoint: 'search', addUserList, query: { filter: `${memo.id}` } }}>
            {users.map((user) => (
              <UserBox key={'userlist' + user.id} {...user} />
            ))}
          </UserList>
        ),
        0: null,
      }[count.favorites],
      categorys: [],
    },
  ]

  return (
    <>
      {children}
      <TitleBox />
      <TabBox
        label={'상세 보기'}
        tabs={panels}
        reset={() => {
          setLeafs([])
          setUsers([])
          setCursor(undefined)
        }}
      />
      <Snackbar open={message ? true : false} autoHideDuration={6000} onClose={() => setMessage('')} message={message} />
    </>
  )
}
