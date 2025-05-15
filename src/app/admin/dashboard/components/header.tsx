'use client'
import { ModeToggle } from '@/libraries/mode-toggle'
import { UserNav } from '@/components/core/user-nav'
import ThemeMode from '@/components/core/ThemeMode'
import { Shield } from 'lucide-react'
import Link from 'next/link'
import ButtonLanguage from '@/components/core/ButtonLanguage'

export default function AdminHeader() {
  return (
    <header className='sticky w-full'>
      <nav className='flex items-center justify-between px-4'>
        <div className='flex items-center gap-2'>
          <Link href="/admin/dashboard">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <span className="font-semibold">UNIKO Admin</span>
            </div>
          </Link>
        </div>
        <div className='ml-auto mt-[0.3rem] flex items-center gap-3'>
          <ButtonLanguage />
          <ThemeMode />
          <ModeToggle />
          <div className='border-l border-border pl-2'>
            <UserNav />
          </div>
        </div>
      </nav>
    </header>
  )
} 