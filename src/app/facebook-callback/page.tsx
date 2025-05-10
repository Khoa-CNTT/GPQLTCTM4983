'use client'

import { motion } from 'framer-motion'
import { emptyStateItemVariants, emptyStateVariants } from '@/components/dashboard/DataTable'
import { Atom } from 'react-loading-indicators'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useUser } from '@/core/users/hooks'
import Cookies from 'js-cookie'
import toast from 'react-hot-toast'
import { setAccessTokenToLocalStorage } from '@/libraries/helpers'

export default function FacebookCallbackPage() {
  const router = useRouter()
  const [executeGetMe, setExecuteGetMe] = useState<boolean>(false)
  let countLogin: number = 0
  const params = useSearchParams()
  const redirect = params.get('redirect')
  const signinStatus = params.get('status')
  const redirectUrl = redirect || '/dashboard/tracker-transaction?loggedIn=true'
  const { getMe } = useUser()
  getMe(executeGetMe)
  useEffect(() => {
    if (countLogin < 1) {
      if (signinStatus === 'success') {
        countLogin++
        const accessToken = Cookies.get('authTokenVerify')
        setAccessTokenToLocalStorage(accessToken as string)

        if (redirectUrl === '/dashboard/tracker-transaction?loggedIn=true') setExecuteGetMe(true)
        toast.success('Login successfully 🚀 ')
        router.push(redirectUrl)
      } else {
        Cookies.remove('authTokenVerify')
        toast.error('Login failed 🚀 ')
        router.push('/sign-in')
      }
    }
  }, [signinStatus])

  return (
    <div className='flex h-screen w-screen items-center justify-center'>
      <motion.div
        initial='hidden'
        animate='visible'
        variants={emptyStateVariants}
        className='flex h-full items-center justify-center'
      >
        <motion.div variants={emptyStateItemVariants}>
          <Atom color='#be123c' size='small' textColor='#be123c' />
        </motion.div>
        {/* <motion.span variants={emptyStateItemVariants} className='font-semibold'>
          {signinStatus === 'success' ? 'Login successfully 🚀' : 'Login failed ❌'}
        </motion.span> */}
      </motion.div>
      <p className='ml-2 text-lg font-medium'></p>
    </div>
  )
}
