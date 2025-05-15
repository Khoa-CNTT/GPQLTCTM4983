'use client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent } from '@/components/ui/card'
import { useEffect, useRef, useState } from 'react'
import Logo2 from '@/images/logo-2.png'
import Image from 'next/image'
import { useAuth } from '@/core/auth/hooks'
import { useRouter } from 'next/navigation'
import FormZod from '@/components/core/FormZod'
import { signInFormBody, signInSchema } from '@/core/auth/constants/sign-in.constant'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { Spotlight } from '@/components/homepage/Spotlight'
import { Shield } from 'lucide-react'
import { ISignInBody } from '@/core/auth/models'
import { ModeToggle } from '@/libraries/mode-toggle'
import ThemeMode from '@/components/core/ThemeMode'
import ButtonLanguage from '@/components/core/ButtonLanguage'
import { useTranslation } from 'react-i18next'

export default function AdminLoginForm() {
  const { adminSignIn, isAdminSigningIn, isRememberMe, setIsRememberMe } = useAuth()
  const formRef = useRef<HTMLFormElement>(null)
  const router = useRouter()
  const { t } = useTranslation(['common'])
  
  const handleSubmit = (value: ISignInBody) => {
    adminSignIn(value)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className='relative flex min-h-screen w-full items-center justify-center overflow-hidden rounded-md bg-background px-4 py-12 pb-[5rem] pt-[5rem] antialiased sm:px-6 md:items-center md:justify-center lg:px-8'
    >
      <div className='fixed inset-0 overflow-hidden'>
        <Spotlight className='left-0 top-40 md:-top-20 md:left-60' fill='white' />
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,128,255,0.1),transparent_70%)]' />
      </div>

      <div
        className='fixed inset-0'
        style={{
          backgroundImage:
            'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}
      />

      <div className="absolute top-4 right-4 flex items-center gap-3">
        <ButtonLanguage />
        <ThemeMode />
        <ModeToggle />
      </div>

      <div className='relative z-10'>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.2 }}
        >
          <Card className='w-full max-w-md rounded-lg border border-border bg-card shadow-xl backdrop-blur-xl'>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2, delay: 0.4 }}
              className='flex items-center justify-center p-4'
            >
              <Link href='/'>
                <div className='flex items-center justify-center' style={{ userSelect: 'none' }}>
                  <Image
                    src={Logo2}
                    alt='Logo'
                    width={300}
                    height={300}
                    priority
                    style={{ objectFit: 'cover' }}
                    className='h-32 w-32'
                  />
                </div>
              </Link>
            </motion.div>

            <CardContent>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.2, delay: 0.6 }}
              >
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                  <h2
                    className='text-center text-2xl font-bold tracking-tight text-foreground sm:text-3xl'
                    style={{ userSelect: 'none' }}
                  >
                    {t('sidebar.admin_login', 'Đăng nhập quản trị')}
                  </h2>
                </div>
                <p className='mt-2 text-center text-sm text-muted-foreground' style={{ userSelect: 'none' }}>
                  {t('sidebar.admin_login_desc', 'Vui lòng đăng nhập để truy cập hệ thống quản trị')}
                </p>

                <FormZod
                  classNameForm='mt-5'
                  formFieldBody={signInFormBody}
                  formSchema={signInSchema}
                  onSubmit={handleSubmit}
                  submitRef={formRef}
                />
                
                <div className='mt-4 flex items-center justify-between'>
                  <div className='flex items-center'>
                    <Checkbox
                      checked={isRememberMe}
                      onCheckedChange={(e) => {
                        setIsRememberMe(e as boolean)
                      }}
                    />
                    <Label htmlFor='remember' className='ml-2 text-sm text-muted-foreground'>
                      {t('sidebar.remember_me', 'Ghi nhớ đăng nhập')}
                    </Label>
                  </div>
                </div>
                
                <Button
                  variant='default'
                  className='mt-4 w-full bg-primary hover:bg-primary/90 text-primary-foreground'
                  onClick={() => formRef.current?.requestSubmit()}
                  isLoading={isAdminSigningIn}
                >
                  {t('button.sign_in', 'Đăng nhập')}
                </Button>
                
                <div className='mt-4 text-center'>
                  <Link href='/'>
                    <span className='text-sm text-muted-foreground hover:text-primary'>
                      {t('button.back_to_home', 'Quay lại trang chính')}
                    </span>
                  </Link>
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
} 