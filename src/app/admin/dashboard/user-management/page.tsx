'use client'

import { useTranslation } from 'react-i18next'
import { UserTable } from './components/user-table'

export default function UserManagementPage() {
  const { t } = useTranslation(['common'])
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight mb-4">
        {t('sidebar.user_management', 'Quản lý người dùng')}
      </h1>
      <UserTable />
    </div>
  )
} 