'use client'
import { ReactNode, useState } from 'react'
import { Typography } from '@mui/material'
import { MemoData, UserData } from '@/shared/types/client'
import MemoEditForm from '@/components/memo/MemoEditForm'
import MemoBox from '@/components/memo/MemoBox'
import LeafCreateForm from '@/components/memo/LeafCreateForm'
import LeafList from '@/components/memo/LeafList'
import TabBox from '@/components/common/TabBox'
import UserBox from '@/components/user/UserBox'
import UserList from '@/components/user/UserList'

interface Props {
  myId: number
  firstLoadMemo: MemoData
  children: ReactNode
  updateItem?: (memo: MemoData) => void
  removeItem?: (itemId: number) => void
}

export default function DetailContainer(props: Props) {
  const { firstLoadMemo, myId, children, updateItem, removeItem } = props
  const [box, setBox] = useState('item')
  const [memo, setMemo] = useState<MemoData>(firstLoadMemo)
  const [users, setUsers] = useState<UserData[]>([])
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
    const actions = { close: () => setBox('item') }
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
    </>
  )
}
