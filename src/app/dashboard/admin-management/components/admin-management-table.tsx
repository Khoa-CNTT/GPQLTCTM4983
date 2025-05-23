'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
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
  Plus
} from 'lucide-react'
import { userRoutes } from '@/api/user'
import httpService from '@/libraries/http'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import toast from 'react-hot-toast'
import { AdminDetailsDialog } from './admin-details-dialog'
import { CreateAdminDialog } from './create-admin-dialog'

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

interface AdminResponse {
  data: Admin[]
}

export function AdminManagementTable() {
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const queryClient = useQueryClient()

  const { data: adminsData, isLoading, refetch } = useQuery({
    queryKey: ['admins'],
    queryFn: async () => {
      const response = await httpService.get<AdminResponse>(userRoutes.getAllUsers)
      // Lọc ra những user có roleId khác null
      const adminUsers = response.payload.data.filter(user => user.roleId !== null);
      return {
        ...response.payload,
        data: adminUsers
      };
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
      toast.success(`Quản trị viên đã được cập nhật trạng thái thành công!`)
    },
    onError: (error: AxiosError | any) => {
      if (error.response?.status === 401) {
        return toast.error(`${error?.response?.data?.messages || error?.response?.data?.message} !`)
      }
      console.error('Lỗi khi cập nhật trạng thái quản trị viên:', error)
      toast.error(error?.response?.data?.message || 'Không thể cập nhật trạng thái quản trị viên. Vui lòng thử lại sau.')
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
    switch (roleId) {
      case 'SUPER_ADMIN':
        return 'Quản trị viên cao cấp'
      case 'ADMIN':
        return 'Quản trị viên'
      case 'MODERATOR':
        return 'Điều phối viên'
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

  const filteredAdmins = adminsData?.data?.filter(admin => 
    admin.email?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    admin.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.phone_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getRoleLabel(admin.roleId).toLowerCase().includes(searchTerm.toLowerCase())
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
              <CardTitle>Quản lý quản trị viên</CardTitle>
              <CardDescription>
                Tổng cộng có {adminsData?.data?.length || 0} quản trị viên trong hệ thống
              </CardDescription>
            </div>
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Thêm quản trị viên
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Tìm kiếm theo tên, email, vai trò hoặc số điện thoại..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon" className="shrink-0">
              <Filter className="h-4 w-4" />
              <span className="sr-only">Lọc</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Quản trị viên</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Số điện thoại</TableHead>
              <TableHead className="w-[140px]">Trạng thái</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
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
                      <p className="font-medium">{admin.fullName || 'Chưa cập nhật'}</p>
                    </div>
                  </TableCell>
                  <TableCell>{admin.email}</TableCell>
                  <TableCell>{admin.phone_number || 'Chưa cập nhật'}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`${getStatusColor(admin.status)} w-[120px] text-center`}
                    >
                      {admin.status === 'ACTIVE' ? 'Hoạt động' : 'Không hoạt động'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Mở menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewDetails(admin)}>
                          <Eye className="mr-2 h-4 w-4" />
                          <span>Xem chi tiết</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => updateAdminStatus(admin.id, 'ACTIVE')}>
                          <UserCheck className="mr-2 h-4 w-4" />
                          <span>Kích hoạt</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateAdminStatus(admin.id, 'BLOCK')}>
                          <UserX className="mr-2 h-4 w-4" />
                          <span>Vô hiệu hóa</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Không tìm thấy quản trị viên nào.
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
        onSuccess={() => refetch()}
      />
    </>
  )
}

function LoadingTable() {
  return (
    <>
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="h-6 w-40 animate-pulse rounded-md bg-muted"></div>
              <div className="h-4 w-60 animate-pulse rounded-md bg-muted"></div>
            </div>
            <div className="h-10 w-40 animate-pulse rounded-md bg-muted"></div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="h-10 w-full animate-pulse rounded-md bg-muted"></div>
            <div className="h-10 w-10 animate-pulse rounded-md bg-muted"></div>
          </div>
        </CardContent>
      </Card>

      <div className="rounded-md border">
        <div className="h-[300px] animate-pulse bg-muted/20"></div>
      </div>
    </>
  )
} 