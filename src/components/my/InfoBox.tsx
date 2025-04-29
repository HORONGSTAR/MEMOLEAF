'use client'
import { Skeleton, Typography, List, ListItem } from '@mui/material'
import { Avatar, Stack } from '@/components'
import { getUser } from '@/lib/api/userApi'
import { useParams } from 'next/navigation'
import { useState, useEffect, useCallback } from 'react'

type Profile = { name: string; info: string; image: string }

export default function InfoBox() {
  const [profile, setProfile] = useState<Profile>()
  const { id } = useParams()

  const handleLoad = useCallback(async () => {
    const data = await getUser(id as string)
    setProfile(data)
  }, [id])

  useEffect(() => {
    handleLoad()
  }, [handleLoad])

  return (
    <Stack>
      {profile ? (
        <>
          <Avatar variant="rounded" size={160} user={profile} />
          <List sx={{ flexGrow: 1 }}>
            <ListItem>
              <Typography variant="h5" fontWeight={'bold'}>
                {profile.name}
              </Typography>
            </ListItem>
            <ListItem>{profile.info || '자기소개가 없습니다.'}</ListItem>
          </List>
        </>
      ) : (
        <>
          <Skeleton variant="rounded" width={160} height={160} />
          <List sx={{ flexGrow: 1 }}>
            {[...Array(4)].map((key, idx) => (
              <ListItem key={'info' + idx}>
                <Skeleton width={'100%'} height={20} />
              </ListItem>
            ))}
          </List>
        </>
      )}
    </Stack>
  )
}
