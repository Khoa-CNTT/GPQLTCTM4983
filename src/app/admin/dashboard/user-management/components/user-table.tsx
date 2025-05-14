'use client'

import { useState } from 'react'
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
  UserX 
} from 'lucide-react'
import { userRoutes } from '@/api/user'
import httpService from '@/libraries/http'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { UserDetailsDialog } from '@/app/dashboard/user-management/components/user-details-dialog'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

export interface User {
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

interface UserResponse {
  data: User[]
  total: number
}

function LoadingTable() {
  return (
    <div className="flex items-center justify-center h-40">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-b-transparent border-primary"></div>
    </div>
  )
}

export function UserTable() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const queryClient = useQueryClient()
  const { t } = useTranslation(['common'])

  const { data: usersData, isLoading, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await httpService.get<UserResponse>(userRoutes.getAllUsers)
      // Lọc ra những user có roleId là null (không phải admin)
      const regularUsers = response.payload.data.filter(user => user.roleId === null);
      return {
        ...response.payload,
        data: regularUsers
      };
    },
  })

  // Sử dụng useMutation để cập nhật trạng thái người dùng
  const updateUserStatusMutation = useMutation({
    mutationFn: async ({ userId, status }: { userId: string, status: 'ACTIVE' | 'BLOCK' }) => {
      const url = userRoutes.updateUserStatus.replace(':id', userId)
      return await httpService.patch(url, { status })
    },
    onSuccess: () => {
      // Cập nhật lại dữ liệu sau khi thành công
      queryClient.invalidateQueries({ queryKey: ['users'] })
      refetch()
      toast.success(t('user.status_update_success', 'Người dùng đã được cập nhật trạng thái thành công!'))
    },
    onError: (error) => {
      console.error('Lỗi khi cập nhật trạng thái người dùng:', error)
      toast.error(t('user.status_update_error', 'Không thể cập nhật trạng thái người dùng. Vui lòng thử lại sau.'))
    }
  })

  const getInitials = (name: string | null) => {
    if (!name) return 'U'
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

  const handleViewDetails = (user: User) => {
    setSelectedUser(user)
    setIsDetailsOpen(true)
  }

  const updateUserStatus = (userId: string, status: 'ACTIVE' | 'BLOCK') => {
    updateUserStatusMutation.mutate({ userId, status })
  }

  const filteredUsers = usersData?.data?.filter(user => 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone_number?.toLowerCase().includes(searchTerm.toLowerCase())
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
              <CardTitle>{t('sidebar.user_management', 'Quản lý người dùng')}</CardTitle>
              <CardDescription>
                {t('user.total_count', 'Tổng cộng có {{count}} người dùng trong hệ thống', {
                  count: usersData?.data?.length || 0
                })}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t('user.search_placeholder', 'Tìm kiếm theo tên, email hoặc số điện thoại...')}
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
              <TableHead>{t('user.user', 'Người dùng')}</TableHead>
              <TableHead>{t('user.email', 'Email')}</TableHead>
              <TableHead>{t('user.phone', 'Số điện thoại')}</TableHead>
              <TableHead className="w-[140px]">{t('user.status', 'Trạng thái')}</TableHead>
              <TableHead className="text-right">{t('user.actions', 'Thao tác')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user: User) => (
                <TableRow key={user.id} className="group hover:bg-muted/40">
                  <TableCell className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={user.avatarId || ''} />
                      <AvatarFallback>{getInitials(user.fullName)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.fullName || t('user.not_updated', 'Chưa cập nhật')}</p>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone_number || t('user.not_updated', 'Chưa cập nhật')}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`${getStatusColor(user.status)} w-[120px] text-center`}
                    >
                      {user.status === 'ACTIVE' 
                        ? t('user.status.active', 'Hoạt động') 
                        : t('user.status.inactive', 'Không hoạt động')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">{t('user.open_menu', 'Mở menu')}</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewDetails(user)}>
                          <Eye className="mr-2 h-4 w-4" />
                          <span>{t('user.view_details', 'Xem chi tiết')}</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => updateUserStatus(user.id, 'ACTIVE')}>
                          <UserCheck className="mr-2 h-4 w-4" />
                          <span>{t('user.activate', 'Kích hoạt')}</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateUserStatus(user.id, 'BLOCK')}>
                          <UserX className="mr-2 h-4 w-4" />
                          <span>{t('user.deactivate', 'Vô hiệu hóa')}</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  {t('user.no_data', 'Không tìm thấy người dùng nào.')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <UserDetailsDialog 
        user={selectedUser} 
        isOpen={isDetailsOpen} 
        onClose={() => setIsDetailsOpen(false)} 
      />
    </>
  )
} 