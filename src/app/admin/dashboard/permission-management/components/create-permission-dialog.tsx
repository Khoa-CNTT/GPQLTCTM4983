'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import toast from 'react-hot-toast'
import httpService from '@/libraries/http'
import { apiService } from '@/api'
import { useTranslation } from 'react-i18next'
import { handleApiError } from '@/libraries/errorHandler'

interface CreatePermissionDialogProps {
  open: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function CreatePermissionDialog({ open, onClose, onSuccess }: CreatePermissionDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    path: '',
    method: 'GET',
  })
  const queryClient = useQueryClient()
  const { t } = useTranslation(['common'])

  const createPermissionMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      return await httpService.post(apiService.permission.create, data)
    },
    onSuccess: () => {
      // Cập nhật lại dữ liệu sau khi thành công
      queryClient.invalidateQueries({ queryKey: ['permissions'] })
      
      toast.success(t('permission.success_add', 'Đã thêm quyền truy cập thành công!'))
      // Reset form
      setFormData({
        name: '',
        path: '',
        method: 'GET',
      })
      if (onSuccess) onSuccess()
      onClose()
    },
    onError: (error) => {
      handleApiError(error)
    }
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, method: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    createPermissionMutation.mutate(formData)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {t('permission.add_dialog_title', 'Thêm quyền truy cập mới')}
          </DialogTitle>
          <DialogDescription>
            {t('permission.add_dialog_desc', 'Nhập thông tin quyền truy cập API vào form bên dưới')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 py-4">
          <div className="grid w-full gap-2">
            <Label htmlFor="name">
              {t('permission.name_field', 'Tên quyền')}
            </Label>
            <Input
              id="name"
              name="name"
              placeholder={t('permission.name_placeholder', 'Ví dụ: Tạo người dùng mới')}
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid w-full gap-2">
            <Label htmlFor="path">
              {t('permission.path_field', 'Đường dẫn API')}
            </Label>
            <Input
              id="path"
              name="path"
              placeholder={t('permission.path_placeholder', 'Ví dụ: /users')}
              value={formData.path}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid w-full gap-2">
            <Label htmlFor="method">
              {t('permission.method_field', 'Phương thức')}
            </Label>
            <Select
              value={formData.method}
              onValueChange={handleSelectChange}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('permission.select_method', 'Chọn phương thức')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GET">GET</SelectItem>
                <SelectItem value="POST">POST</SelectItem>
                <SelectItem value="PUT">PUT</SelectItem>
                <SelectItem value="PATCH">PATCH</SelectItem>
                <SelectItem value="DELETE">DELETE</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" type="button" onClick={onClose}>
              {t('button.cancel', 'Hủy')}
            </Button>
            <Button type="submit">
              {t('button.add_permission', 'Thêm quyền truy cập')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 