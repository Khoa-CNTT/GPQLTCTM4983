'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import { 
  Eye, 
  Filter, 
  MoreHorizontal, 
  Search, 
  UserCheck, 
  UserX,
  Plus,
  Trash
} from 'lucide-react'
import { userRoutes } from '@/api/user'
import httpService from '@/libraries/http'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import toast from 'react-hot-toast'
import { AdminDetailsDialog } from '@/app/dashboard/admin-management/components/admin-details-dialog'
import { CreateAdminDialog } from '@/app/dashboard/admin-management/components/create-admin-dialog'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AxiosError } from 'axios'
import { handleApiError } from '@/libraries/errorHandler'

// Giữ lại type Admin từ component gốc
export interface Admin {
  id: string
  fullName: string | null
  email: string
  status: string
  avatarId: string | null
  phone_number: string | null
  roleId: string
  dateOfBirth: string | null
  gender: string | null
  profession: string | null
  experience: string | null
  workplace: string | null
  address: string | null
}

// Thêm interface cho response từ API
interface AdminResponse {
  data: Admin[]
  total: number
}

function LoadingTable() {
  return (
    <div className="flex items-center justify-center h-40">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-b-transparent border-primary"></div>
    </div>
  )
}

export function AdminTable() {
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const queryClient = useQueryClient()
  const { t } = useTranslation(['common'])

  const { data: adminsData, isLoading, refetch } = useQuery({
    queryKey: ['admins'],
    queryFn: async () => {
      try {
        const response = await httpService.get<AdminResponse>(userRoutes.getAllUsers)
        // Lọc ra những user có roleId khác null
        const adminUsers = response.payload?.data?.filter(user => user?.roleId !== null) || [];
        return {
          ...response.payload,
          data: adminUsers
        };
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu admin:', error);
        return { data: [], total: 0 };
      }
    },
  })

  // Sử dụng useMutation để cập nhật trạng thái admin
  const updateAdminStatusMutation = useMutation({
    mutationFn: async ({ adminId, status }: { adminId: string, status: 'ACTIVE' | 'BLOCK' }) => {
      const url = userRoutes.updateUserStatus.replace(':id', adminId)
      return await httpService.patch(url, { status })
    },
    onSuccess: () => {
      // Cập nhật lại dữ liệu sau khi thành công
      queryClient.invalidateQueries({ queryKey: ['admins'] })
      queryClient.invalidateQueries({ queryKey: ['users'] })
      refetch()
      toast.success(t('admin.status_update_success', 'Quản trị viên đã được cập nhật trạng thái thành công!'))
    },
    onError: (error: any) => {
      handleApiError(error)
    }
  })

  // Sử dụng useMutation để xóa admin
  const deleteAdminMutation = useMutation({
    mutationFn: async (adminId: string) => {
      const url = userRoutes.deleteUser.replace(':id', adminId)
      return await httpService.delete(url)
    },
    onSuccess: () => {
      // Cập nhật lại dữ liệu sau khi thành công
      queryClient.invalidateQueries({ queryKey: ['admins'] })
      queryClient.invalidateQueries({ queryKey: ['users'] })
      refetch()
      toast.success(t('admin.delete_success', 'Quản trị viên đã được xóa thành công!'))
    },
    onError: (error: any) => {
      handleApiError(error)
    }
  })

  const getInitials = (name: string | null) => {
    if (!name) return 'A'
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-500/10 text-green-500 hover:bg-green-500/20'
      case 'INACTIVE':
        return 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
      default:
        return 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20'
    }
  }

  const getRoleLabel = (roleId: string) => {
    // Sử dụng t() để dịch nhãn vai trò
    switch (roleId) {
      case 'SUPER_ADMIN':
        return t('admin.role.super_admin', 'Quản trị viên cao cấp')
      case 'ADMIN':
        return t('admin.role.admin', 'Quản trị viên')
      case 'MODERATOR':
        return t('admin.role.moderator', 'Điều phối viên')
      default:
        return roleId
    }
  }

  const handleViewDetails = (admin: Admin) => {
    setSelectedAdmin(admin)
    setIsDetailsOpen(true)
  }

  const updateAdminStatus = (adminId: string, status: 'ACTIVE' | 'BLOCK') => {
    updateAdminStatusMutation.mutate({ adminId, status })
  }

  const handleDeleteAdmin = (adminId: string) => {
    if (confirm(t('admin.confirm_delete', 'Bạn có chắc chắn muốn xóa quản trị viên này không? Hành động này không thể hoàn tác.'))) {
      deleteAdminMutation.mutate(adminId)
    }
  }

  const filteredAdmins = adminsData?.data?.filter(admin => 
    (admin?.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
    (admin?.fullName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (admin?.phone_number?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (getRoleLabel(admin?.roleId || '').toLowerCase() || '').includes(searchTerm.toLowerCase())
  ) || []

  if (isLoading) {
    return <LoadingTable />
  }

  return (
    <>
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t('sidebar.admin_management', 'Quản lý quản trị viên')}</CardTitle>
              <CardDescription>
                {t('admin.total_count', 'Tổng cộng có {{count}} quản trị viên trong hệ thống', {
                  count: adminsData?.data?.length || 0
                })}
              </CardDescription>
            </div>
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> {t('button.add_admin', 'Thêm quản trị viên')}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t('admin.search_placeholder', 'Tìm kiếm theo tên, email, vai trò hoặc số điện thoại...')}
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon" className="shrink-0">
              <Filter className="h-4 w-4" />
              <span className="sr-only">{t('table.filterPlaceholder', 'Lọc')}</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('admin.admin', 'Quản trị viên')}</TableHead>
              <TableHead>{t('admin.email', 'Email')}</TableHead>
              <TableHead>{t('admin.phone', 'Số điện thoại')}</TableHead>
              <TableHead className="w-[140px]">{t('admin.status', 'Trạng thái')}</TableHead>
              <TableHead className="text-right">{t('admin.actions', 'Thao tác')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAdmins.length > 0 ? (
              filteredAdmins.map((admin: Admin) => (
                <TableRow key={admin.id} className="group hover:bg-muted/40">
                  <TableCell className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={admin.avatarId || ''} />
                      <AvatarFallback>{getInitials(admin.fullName)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{admin.fullName || t('admin.not_updated', 'Chưa cập nhật')}</p>
                    </div>
                  </TableCell>
                  <TableCell>{admin.email}</TableCell>
                  <TableCell>{admin.phone_number || t('admin.not_updated', 'Chưa cập nhật')}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`${getStatusColor(admin.status)} w-[120px] text-center`}
                    >
                      {admin.status === 'ACTIVE' 
                        ? t('admin.status.active', 'Hoạt động') 
                        : t('admin.status.inactive', 'Không hoạt động')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">{t('admin.open_menu', 'Mở menu')}</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewDetails(admin)}>
                          <Eye className="mr-2 h-4 w-4" />
                          <span>{t('admin.view_details', 'Xem chi tiết')}</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => updateAdminStatus(admin.id, 'ACTIVE')}>
                          <UserCheck className="mr-2 h-4 w-4" />
                          <span>{t('admin.activate', 'Kích hoạt')}</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateAdminStatus(admin.id, 'BLOCK')}>
                          <UserX className="mr-2 h-4 w-4" />
                          <span>{t('admin.deactivate', 'Vô hiệu hóa')}</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleDeleteAdmin(admin.id)}
                          className="text-red-500 focus:text-red-500 focus:bg-red-50"
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          <span>{t('admin.delete', 'Xóa quản trị viên')}</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  {t('admin.no_data', 'Không tìm thấy quản trị viên nào.')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <AdminDetailsDialog 
        admin={selectedAdmin} 
        isOpen={isDetailsOpen} 
        onClose={() => setIsDetailsOpen(false)} 
      />

      <CreateAdminDialog
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={() => {
          refetch()
          setIsCreateOpen(false)
        }}
      />
    </>
  )
} 