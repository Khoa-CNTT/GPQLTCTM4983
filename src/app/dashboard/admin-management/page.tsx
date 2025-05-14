'use client'

import { AdminManagementTable } from './components/admin-management-table'
import { PermissionsTable } from './components/permissions-table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function AdminManagementPage() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="admins">
        <TabsList>
          <TabsTrigger value="admins">Quản lý quản trị viên</TabsTrigger>
          <TabsTrigger value="permissions">Quản lý quyền truy cập</TabsTrigger>
        </TabsList>
        <TabsContent value="admins" className="space-y-6 mt-6">
          <AdminManagementTable />
        </TabsContent>
        <TabsContent value="permissions" className="space-y-6 mt-6">
          <PermissionsTable />
        </TabsContent>
      </Tabs>
    </div>
  )
} 