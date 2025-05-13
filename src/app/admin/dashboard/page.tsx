'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Activity, 
  CreditCard, 
  DollarSign, 
  Download, 
  ShieldCheck, 
  Users, 
  UserCog, 
  Wallet,
  BarChart2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import dynamic from 'next/dynamic'
import { useTranslation } from 'react-i18next'

// Lazy load components
const Overview = dynamic(() => import('@/app/admin/dashboard/components/overview').then(mod => ({ default: mod.Overview })), {
  ssr: false,
  loading: () => <div className="h-[350px] flex items-center justify-center">Đang tải dữ liệu...</div>
})

const RecentTransactions = dynamic(() => import('@/app/admin/dashboard/components/recent-transactions'), {
  ssr: false,
  loading: () => <div className="h-[300px] flex items-center justify-center">Đang tải dữ liệu...</div>
})

export default function AdminDashboard() {
  const [mounted, setMounted] = useState(false)
  const [userData, setUserData] = useState<any>(null)
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const { t } = useTranslation(['common'])

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
          <p>Đang tải trang...</p>
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
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            {t('button.reload_data')}
          </Button>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng người dùng</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+2,350</div>
            <p className="text-xs text-muted-foreground">+180 người dùng mới trong tuần này</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng giao dịch</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12,234</div>
            <p className="text-xs text-muted-foreground">+1,234 giao dịch trong tuần này</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Giá trị giao dịch</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$450,543</div>
            <p className="text-xs text-muted-foreground">+22% so với tháng trước</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quản trị viên</CardTitle>
            <UserCog className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 quản trị viên mới trong tháng này</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Tổng quan</CardTitle>
            <CardDescription>
              Biểu đồ tổng quan giao dịch trong 30 ngày qua
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview />
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Giao dịch gần đây</CardTitle>
            <CardDescription>
              Danh sách các giao dịch mới nhất
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecentTransactions />
          </CardContent>
        </Card>
      </div>
    </>
  )
} 