'use client'

import { useStoreLocal } from '@/hooks/useStoreLocal'
import { useEffect, useState } from 'react'
import GoogleOneTap from '../components/core/GoogleOneTap'
import { getAccessTokenFromLocalStorage } from '@/libraries/helpers'
import { useAuth } from '@/core/auth/hooks'
import Cookies from 'js-cookie'
import { usePathname } from 'next/navigation'

export default function Template({ children }: { children: React.ReactNode }) {
  const { user, setUser } = useStoreLocal()
  const isAuthenticated = getAccessTokenFromLocalStorage()
  const refreshToken = Cookies.get('refreshToken')
  const pathname = usePathname()

  // Chỉ xác thực trên các trang cần đăng nhập
  const isAuthenticatedRoute = pathname?.startsWith('/dashboard') ||
    pathname?.includes('/profile') ||
    pathname?.includes('/settings')

  const { useVerifyToken } = useAuth()

  const { verifyTokenError, handleRedirectToLogin } = useVerifyToken()

  useEffect(() => {
    if (isAuthenticatedRoute && verifyTokenError) {
      handleRedirectToLogin()
    }
  }, [verifyTokenError, isAuthenticatedRoute, handleRedirectToLogin]);

  useEffect(() => {
    if (user === null) {
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }
    }
  }, [user])

  return (
    <div>
      {/* {!isAuthenticated && <GoogleOneTap></GoogleOneTap>} */}
      {children}
    </div>
  )
}
