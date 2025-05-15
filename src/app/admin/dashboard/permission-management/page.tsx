'use client'

import { useTranslation } from 'react-i18next'
import { PermissionsTable } from './components/permissions-table'

export default function PermissionManagementPage() {
  const { t } = useTranslation(['common'])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight mb-4">
        {t('sidebar.permission_management', 'Quản lý quyền truy cập')}
      </h1>
      
      <PermissionsTable />
    </div>
  )
} 