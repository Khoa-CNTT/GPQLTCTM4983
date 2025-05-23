'use client'

import { Admin } from './admin-management-table'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { 
  Calendar, 
  Mail, 
  MapPin, 
  Phone, 
  User2, 
  Building,
  BadgeCheck
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface AdminDetailsDialogProps {
  admin: Admin | null
  isOpen: boolean
  onClose: () => void
}

export function AdminDetailsDialog({ admin, isOpen, onClose }: AdminDetailsDialogProps) {
  const { t } = useTranslation(['common'])
  
  if (!admin) return null

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
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return t('admin.not_updated', 'Chưa cập nhật')
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })
    } catch (error) {
      return t('admin.invalid_date_format', 'Định dạng không hợp lệ')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t('admin.admin_details', 'Chi tiết quản trị viên')}</DialogTitle>
          <DialogDescription>
            {t('admin.admin_details_description', 'Thông tin chi tiết của quản trị viên trong hệ thống')}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-4 pt-2">
          <Avatar className="h-24 w-24 border-4 bg-gradient-to-r from-primary to-primary/60">
            <AvatarImage src={admin.avatarId || ''} />
            <AvatarFallback>{getInitials(admin.fullName)}</AvatarFallback>
          </Avatar>
          <div className="text-center">
            <h2 className="text-xl font-bold">{admin.fullName || t('admin.not_updated', 'Chưa cập nhật')}</h2>
            <Badge
              variant="outline"
              className={`mt-2 ${getStatusColor(admin.status)}`}
            >
              {admin.status === 'ACTIVE' 
                ? t('admin.status.active', 'Hoạt động') 
                : t('admin.status.inactive', 'Không hoạt động')}
            </Badge>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Mail className="mt-0.5 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t('admin.email', 'Email')}</p>
                <p>{admin.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="mt-0.5 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t('admin.phone', 'Số điện thoại')}</p>
                <p>{admin.phone_number || t('admin.not_updated', 'Chưa cập nhật')}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t('admin.address', 'Địa chỉ')}</p>
                <p>{admin.address || t('admin.not_updated', 'Chưa cập nhật')}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="mt-0.5 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t('admin.date_of_birth', 'Ngày sinh')}</p>
                <p>{formatDate(admin.dateOfBirth)}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <User2 className="mt-0.5 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t('admin.gender', 'Giới tính')}</p>
                <p>{admin.gender || t('admin.not_updated', 'Chưa cập nhật')}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Building className="mt-0.5 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t('admin.workplace', 'Nơi làm việc')}</p>
                <p>{admin.workplace || t('admin.not_updated', 'Chưa cập nhật')}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <BadgeCheck className="mt-0.5 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t('admin.admin_id', 'ID Quản trị viên')}</p>
                <p className="break-all">{admin.id}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 