'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
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
import { UserDetailsDialog } from './user-details-dialog'
import toast from 'react-hot-toast'
import { useQueryClient } from '@tanstack/react-query'

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
}

export function UserManagementTable() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const queryClient = useQueryClient()

  const { data: usersData, isLoading, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await httpService.get<UserResponse>(userRoutes.getAllUsers)
      return response.payload
    },
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

  const updateUserStatus = async (userId: string, status: 'ACTIVE' | 'BLOCK') => {
    try {
      const url = userRoutes.updateUserStatus.replace(':id', userId)
      await httpService.patch(url, { status })
      
      // Refresh data after update
      await queryClient.invalidateQueries({ queryKey: ['users'] })
      await refetch()
      
      toast.success(`Người dùng đã được ${status === 'ACTIVE' ? 'kích hoạt' : 'vô hiệu hóa'} thành công!`)
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái người dùng:', error)
      toast.error('Không thể cập nhật trạng thái người dùng. Vui lòng thử lại sau.')
    }
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
          <CardTitle>Quản lý người dùng</CardTitle>
          <CardDescription>
            Tổng cộng có {usersData?.data?.length || 0} người dùng trong hệ thống
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Tìm kiếm theo tên, email hoặc số điện thoại..."
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
              <TableHead>Người dùng</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Số điện thoại</TableHead>
              <TableHead className="w-[140px]">Trạng thái</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
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
                      <p className="font-medium">{user.fullName || 'Chưa cập nhật'}</p>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone_number || 'Chưa cập nhật'}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`${getStatusColor(user.status)} w-[120px] text-center`}
                    >
                      {user.status === 'ACTIVE' ? 'Hoạt động' : 'Không hoạt động'}
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
                        <DropdownMenuItem onClick={() => handleViewDetails(user)}>
                          <Eye className="mr-2 h-4 w-4" />
                          <span>Xem chi tiết</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => updateUserStatus(user.id, 'ACTIVE')}>
                          <UserCheck className="mr-2 h-4 w-4" />
                          <span>Kích hoạt</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateUserStatus(user.id, 'BLOCK')}>
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
                <TableCell colSpan={5} className="h-24 text-center">
                  Không tìm thấy người dùng nào.
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

function LoadingTable() {
  return (
    <>
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <div className="h-6 w-40 animate-pulse rounded-md bg-muted"></div>
          <div className="h-4 w-60 animate-pulse rounded-md bg-muted"></div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="h-10 w-full animate-pulse rounded-md bg-muted"></div>
            <div className="h-10 w-10 animate-pulse rounded-md bg-muted"></div>
          </div>
        </CardContent>
      </Card>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Người dùng</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Số điện thoại</TableHead>
              <TableHead className="w-[140px]">Trạng thái</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array(5)
              .fill(0)
              .map((_, index) => (
                <TableRow key={index}>
                  <TableCell className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
                    <div>
                      <div className="h-4 w-32 bg-muted animate-pulse" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-40 bg-muted animate-pulse" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-32 bg-muted animate-pulse" />
                  </TableCell>
                  <TableCell>
                    <div className="h-6 w-24 bg-muted animate-pulse" />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="ml-auto h-8 w-8 bg-muted animate-pulse" />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </>
  )
} 