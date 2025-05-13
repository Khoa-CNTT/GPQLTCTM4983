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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { 
  Filter, 
  MoreHorizontal, 
  Search, 
  Trash,
  Shield,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { apiService } from '@/api'
import httpService from '@/libraries/http'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import toast from 'react-hot-toast'
import { CreatePermissionDialog } from './create-permission-dialog'
import { useTranslation } from 'react-i18next'

export interface Permission {
  id: string
  name: string
  path: string
  method: string
}

interface PermissionResponse {
  data: Permission[]
  total: number
  currentPage: number
  totalPages: number
}

function LoadingTable() {
  return (
    <div className="flex items-center justify-center h-40">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-b-transparent border-primary"></div>
    </div>
  )
}

export function PermissionsTable() {
  const [searchTerm, setSearchTerm] = useState('')
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const queryClient = useQueryClient()
  const { t } = useTranslation(['common'])

  const { data: permissionsData, isLoading, refetch } = useQuery({
    queryKey: ['permissions', currentPage, limit, searchTerm],
    queryFn: async () => {
      const response = await httpService.get<PermissionResponse>(
        `${apiService.permission.getAll}?page=${currentPage}&limit=${limit}`
      )
      return response.payload
    },
  })

  const deletePermissionMutation = useMutation({
    mutationFn: async (permissionId: string) => {
      const url = apiService.permission.delete.replace(':id', permissionId)
      return await httpService.delete(url)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permissions'] })
      refetch()
      toast.success(t('permission.delete_success', 'Quyền truy cập đã được xóa thành công!'))
    },
    onError: (error) => {
      console.error('Lỗi khi xóa quyền truy cập:', error)
      toast.error(t('permission.delete_error', 'Không thể xóa quyền truy cập. Vui lòng thử lại sau.'))
    }
  })

  const handleDelete = (permissionId: string) => {
    if (confirm(t('permission.confirm_delete', 'Bạn có chắc chắn muốn xóa quyền truy cập này không?'))) {
      deletePermissionMutation.mutate(permissionId)
    }
  }

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET':
        return 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20'
      case 'POST':
        return 'bg-green-500/10 text-green-500 hover:bg-green-500/20'
      case 'PUT':
        return 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20'
      case 'PATCH':
        return 'bg-orange-500/10 text-orange-500 hover:bg-orange-500/20'
      case 'DELETE':
        return 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
      default:
        return 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20'
    }
  }

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  // Đảm bảo dữ liệu tồn tại trước khi lọc
  const filteredPermissions = permissionsData?.data?.filter(permission => 
    (permission.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
    (permission.path?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (permission.method?.toLowerCase() || '').includes(searchTerm.toLowerCase())
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
              <CardTitle>{t('sidebar.permission_management', 'Quản lý quyền truy cập')}</CardTitle>
              <CardDescription>
                {t('permission.total_count', 'Tổng cộng có {{count}} quyền truy cập trong hệ thống', {
                  count: permissionsData?.total || 0
                })}
              </CardDescription>
            </div>
            <Button onClick={() => setIsCreateOpen(true)}>
              <Shield className="mr-2 h-4 w-4" /> {t('button.add_permission', 'Thêm quyền truy cập')}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t('permission.search_placeholder', 'Tìm kiếm quyền truy cập...')}
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

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('permission.name', 'Tên quyền')}</TableHead>
              <TableHead>{t('permission.path', 'Đường dẫn')}</TableHead>
              <TableHead className="w-[120px]">{t('permission.method', 'Phương thức')}</TableHead>
              <TableHead className="text-right">{t('permission.actions', 'Thao tác')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPermissions.length > 0 ? (
              filteredPermissions.map((permission: Permission) => (
                <TableRow key={permission.id} className="group hover:bg-muted/40">
                  <TableCell className="font-medium">{permission.name}</TableCell>
                  <TableCell>{permission.path}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`${getMethodColor(permission.method)} text-center`}
                    >
                      {permission.method}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">{t('permission.open_menu', 'Mở menu')}</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleDelete(permission.id)}>
                          <Trash className="mr-2 h-4 w-4" />
                          <span>{t('permission.delete', 'Xóa quyền')}</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  {t('permission.no_data', 'Không tìm thấy quyền truy cập nào.')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {permissionsData && permissionsData.totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              {t('permission.showing_items', 'Hiển thị {{from}} - {{to}} trên {{total}} quyền truy cập', {
                from: (currentPage - 1) * limit + 1,
                to: Math.min(currentPage * limit, permissionsData.total),
                total: permissionsData.total
              })}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === permissionsData.totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
      
      <CreatePermissionDialog 
        open={isCreateOpen} 
        onClose={() => setIsCreateOpen(false)}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ['permissions'] })
          refetch()
        }}
      />
    </>
  )
} 