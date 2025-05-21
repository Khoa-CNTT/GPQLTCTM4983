'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Download, 
  Users, 
  UserCog
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { userRoutes } from '@/api/user'
import httpService from '@/libraries/http'
import { useQuery } from '@tanstack/react-query'
import { translate } from '@/libraries/utils'

interface User {
  id: string
  fullName: string | null
  email: string
  status: string
  avatarId: string | null
  phone_number: string | null
  roleId: string | null
}

interface UserResponse {
  data: User[]
  total: number
}

export default function AdminDashboard() {
  const [mounted, setMounted] = useState(false)
  const [userData, setUserData] = useState<any>(null)
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  
  // Sử dụng i18n
  const { i18n } = useTranslation()
  const t = translate(['common'])
  const [languageKey, setLanguageKey] = useState(i18n?.language || 'en')
  
  // Xử lý thay đổi ngôn ngữ
  useEffect(() => {
    const handleLanguageChange = () => {
      setLanguageKey(i18n?.language || 'en')
    }
    
    window.addEventListener('languageChanged', handleLanguageChange)
    
    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange)
    }
  }, [i18n])

  // Truy vấn dữ liệu người dùng từ API
  const { data: usersData, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['dashboard-users'],
    queryFn: async () => {
      const response = await httpService.get<UserResponse>(userRoutes.getAllUsers)
      return response.payload.data
    },
    enabled: mounted && userData?.roleId !== null
  })

  // Đếm số lượng người dùng và admin
  const normalUsersCount = usersData?.filter(user => user.roleId === null).length || 0
  const adminCount = usersData?.filter(user => user.roleId !== null).length || 0

  // Kiểm tra quyền admin khi component mount
  useEffect(() => {
    setMounted(true)
    setIsLoading(true)
    
    // Lấy dữ liệu user từ localStorage khi component mount
    const userFromStorage = localStorage.getItem('user')
    console.log('User from localStorage:', userFromStorage)
    
    if (userFromStorage) {
      try {
        const userData = JSON.parse(userFromStorage)
        console.log('Parsed user data:', userData)
        setUserData(userData)
        
        // Kiểm tra quyền admin - chỉ cần kiểm tra roleId khác null
        if (userData.roleId === null) {
          console.log('Không có quyền truy cập: roleId là null')
          toast.error('Bạn không có quyền truy cập trang quản trị')
          router.push('/admin/login')
        } else {
          console.log('Người dùng có quyền truy cập với roleId:', userData.roleId)
        }
      } catch (error) {
        console.error('Lỗi khi phân tích dữ liệu người dùng:', error)
        router.push('/admin/login')
      } finally {
        setIsLoading(false)
      }
    } else {
      // Không có dữ liệu người dùng, chuyển hướng về trang đăng nhập
      console.log('Không tìm thấy dữ liệu người dùng trong localStorage')
      router.push('/admin/login')
      setIsLoading(false)
    }
  }, [router])

  // Hiển thị loading khi đang kiểm tra
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-b-transparent border-primary mx-auto mb-4"></div>
          <p>{t('common.loading', 'Đang tải trang...')}</p>
        </div>
      </div>
    )
  }

  // Không render gì nếu component chưa mount xong để tránh hiện flash nội dung
  if (!mounted) return null
  
  // Nếu không có user hoặc không phải admin, không hiển thị nội dung
  if (!userData || userData.roleId === null) {
    console.log('Ẩn nội dung: userData không tồn tại hoặc roleId là null')
    return null
  }

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{t('breadcrumb.dashboard')}</h1>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.total_users', 'Tổng người dùng')}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoadingUsers ? '...' : normalUsersCount}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.total_admins', 'Quản trị viên')}</CardTitle>
            <UserCog className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoadingUsers ? '...' : adminCount}</div>
          </CardContent>
        </Card>
      </div>
    </>
  )
} 