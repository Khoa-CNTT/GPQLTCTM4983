'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { userRoutes } from '@/api/user'
import httpService from '@/libraries/http'
import toast from 'react-hot-toast'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { handleApiError } from '@/libraries/errorHandler'

interface CreateAdminDialogProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function CreateAdminDialog({ isOpen, onClose, onSuccess }: CreateAdminDialogProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    roleId: 'ADMIN',
    phone_number: '',
  })
  const queryClient = useQueryClient()
  const { t } = useTranslation(['common'])

  const createAdminMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      return await httpService.post(userRoutes.createAdmin, data)
    },
    onSuccess: () => {
      // Cập nhật lại dữ liệu sau khi thành công
      queryClient.invalidateQueries({ queryKey: ['admins'] })
      queryClient.invalidateQueries({ queryKey: ['users'] })
      
      toast.success(t('admin.add_success', 'Đã thêm quản trị viên thành công!'))
      // Reset form
      setFormData({
        fullName: '',
        email: '',
        password: '',
        roleId: 'ADMIN',
        phone_number: '',
      })
      onSuccess()
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    createAdminMutation.mutate(formData)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {t('admin.add_dialog_title', 'Thêm quản trị viên mới')}
          </DialogTitle>
          <DialogDescription>
            {t('admin.add_dialog_desc', 'Nhập thông tin của quản trị viên mới vào form bên dưới')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 py-4">
          <div className="grid w-full gap-2">
            <Label htmlFor="fullName">
              {t('admin.fullname_field', 'Họ và tên')}
            </Label>
            <Input
              id="fullName"
              name="fullName"
              placeholder={t('admin.fullname_placeholder', 'Nhập tên đầy đủ')}
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid w-full gap-2">
            <Label htmlFor="email">
              {t('admin.email_field', 'Email')}
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="example@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid w-full gap-2">
            <Label htmlFor="password">
              {t('admin.password_field', 'Mật khẩu')}
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid w-full gap-2">
            <Label htmlFor="phone_number">
              {t('admin.phone_field', 'Số điện thoại')}
            </Label>
            <Input
              id="phone_number"
              name="phone_number"
              placeholder={t('admin.phone_placeholder', 'Nhập số điện thoại')}
              value={formData.phone_number}
              onChange={handleChange}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" type="button" onClick={onClose}>
              {t('button.cancel', 'Hủy')}
            </Button>
            <Button type="submit" disabled={createAdminMutation.isPending}>
              {createAdminMutation.isPending 
                ? t('admin.processing', 'Đang xử lý...') 
                : t('button.add_admin', 'Thêm quản trị viên')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 