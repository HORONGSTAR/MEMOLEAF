'use client'

import { SessionProvider } from 'next-auth/react'
import React, { ReactNode } from 'react'

import { Provider } from 'react-redux'
import { store } from '../store'

interface Props {
  children: ReactNode
}
function Providers({ children }: Props) {
  return (
    <Provider store={store}>
      <SessionProvider>{children}</SessionProvider>
    </Provider>
  )
}

export default Providers
