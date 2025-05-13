'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { AdminTable } from './components/admin-table'

export default function AdminManagementPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { t } = useTranslation(['common'])
  
  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab === 'permissions') {
      // Chuyển hướng sang trang quản lý quyền truy cập
      router.push('/admin/dashboard/permission-management')
    }
  }, [searchParams, router])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight mb-4">
        {t('sidebar.admin_management', 'Quản lý quản trị viên')}
      </h1>
      
      <AdminTable />
    </div>
  )
} 