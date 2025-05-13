'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/libraries/utils'
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  LogOut,
  Shield
} from 'lucide-react'
import Logo2 from '@/images/logo-2.png'
import Image from 'next/image'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { removeTokensFromLocalStorage } from '@/libraries/helpers'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

// Tránh xuất nhiều phiên bản của component
const Sidebar = () => {
  const pathname = usePathname()
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { t } = useTranslation(['common'])
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  const navItems = [
    {
      title: t('sidebar.admin_dashboard', 'Dashboard'),
      href: '/admin/dashboard',
      icon: <LayoutDashboard className="mr-2 h-4 w-4" />
    },
    {
      title: t('sidebar.admin_management', 'Quản lý admin'),
      href: '/admin/dashboard/admin-management',
      icon: <ShieldCheck className="mr-2 h-4 w-4" />
    },
    {
      title: t('sidebar.user_management', 'Quản lý người dùng'),
      href: '/admin/dashboard/user-management',
      icon: <Users className="mr-2 h-4 w-4" />
    },
    {
      title: t('sidebar.permission_management', 'Quản lý quyền truy cập'),
      href: '/admin/dashboard/permission-management',
      icon: <Shield className="mr-2 h-4 w-4" />
    }
  ]
  
  // Hàm kiểm tra nếu đường dẫn hiện tại là một phần của href
  const isPathActive = (href: string) => {
    if (!mounted) return false;
    
    // Kiểm tra chính xác cho dashboard
    if (href === '/admin/dashboard' && pathname === '/admin/dashboard') {
      return true;
    }
    
    // Kiểm tra cho trang admin-management
    if (href === '/admin/dashboard/admin-management' && pathname.includes('admin-management')) {
      return true;
    }
    
    // Kiểm tra cho trang user-management
    if (href === '/admin/dashboard/user-management' && pathname.includes('user-management')) {
      return true;
    }
    
    // Kiểm tra cho trang permission-management
    if (href === '/admin/dashboard/permission-management' && pathname.includes('permission-management')) {
      return true;
    }
    
    return false;
  }
  
  // Hàm đăng xuất thủ công
  const handleLogout = () => {
    setIsLoggingOut(true)
    
    try {
      // Xóa tokens từ localStorage
      removeTokensFromLocalStorage()
      
      // Xóa cookies
      Cookies.remove('authTokenVerify', { path: '/' })
      Cookies.remove('refreshToken', { path: '/' })
      
      // Xóa thông tin user
      localStorage.removeItem('user')
      
      toast.success(t('auth.logout_success', 'Đăng xuất thành công'))
      
      // Chuyển hướng về trang đăng nhập admin
      router.push('/admin/login')
    } catch (error) {
      console.error('Lỗi khi đăng xuất:', error)
      toast.error(t('auth.logout_error', 'Có lỗi xảy ra khi đăng xuất'))
    } finally {
      setIsLoggingOut(false)
    }
  }

  // Nếu component chưa mount, render một phiên bản đơn giản hơn
  if (!mounted) {
    return (
      <div className="flex h-screen w-64 flex-col border-r bg-card">
        <div className="flex items-center gap-2 px-6 py-4">
          <div className="w-10 h-10 bg-gray-200 rounded-md"></div>
          <div className="h-6 w-32 bg-gray-200 rounded"></div>
        </div>
        <Separator />
        <nav className="flex-1 overflow-auto p-2">
          <div className="space-y-2">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-10 bg-gray-100 rounded-md"></div>
            ))}
          </div>
        </nav>
        <div className="border-t p-4">
          <div className="h-10 bg-gray-100 rounded-md w-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-card">
      <div className="flex items-center gap-2 px-6 py-4">
        <Image
          src={Logo2}
          alt="Logo"
          width={40}
          height={40}
          priority
          style={{ objectFit: 'cover' }}
        />
        <h1 className="text-lg font-bold text-foreground">UNIKO Admin</h1>
      </div>
      
      <Separator />
      
      <nav className="flex-1 overflow-auto p-2">
        <ul className="flex flex-col gap-1">
          {navItems.map((item, index) => (
            <li key={index}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted",
                  isPathActive(item.href) 
                    ? "bg-muted font-medium text-foreground" 
                    : "text-muted-foreground"
                )}
              >
                {item.icon}
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="border-t p-4">
        <Button 
          variant="outline" 
          className="w-full justify-start text-muted-foreground"
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          {isLoggingOut 
            ? t('auth.logging_out', 'Đang đăng xuất...') 
            : t('auth.logout', 'Đăng xuất')}
        </Button>
      </div>
    </div>
  )
}

export default Sidebar; 