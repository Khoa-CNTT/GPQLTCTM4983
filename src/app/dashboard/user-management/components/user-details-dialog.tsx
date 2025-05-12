'use client'

import { User } from './user-management-table'
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
  Briefcase, 
  BadgeCheck, 
  Shield, 
  Building,
  BookOpen
} from 'lucide-react'

interface UserDetailsDialogProps {
  user: User | null
  isOpen: boolean
  onClose: () => void
}

export function UserDetailsDialog({ user, isOpen, onClose }: UserDetailsDialogProps) {
  if (!user) return null

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Chi tiết người dùng</DialogTitle>
          <DialogDescription>
            Thông tin chi tiết của người dùng trong hệ thống
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-4 pt-2">
          <Avatar className="h-24 w-24 border-4 bg-gradient-to-r from-primary to-primary/60">
            <AvatarImage src={user.avatarId || ''} />
            <AvatarFallback>{getInitials(user.fullName)}</AvatarFallback>
          </Avatar>
          <div className="text-center">
            <h2 className="text-xl font-bold">{user.fullName || 'Chưa cập nhật'}</h2>
            <Badge
              variant="outline"
              className={`mt-2 ${getStatusColor(user.status)}`}
            >
              {user.status === 'ACTIVE' ? 'Hoạt động' : 'Không hoạt động'}
            </Badge>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Mail className="mt-0.5 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p>{user.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="mt-0.5 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Số điện thoại</p>
                <p>{user.phone_number || 'Chưa cập nhật'}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Địa chỉ</p>
                <p>{user.address || 'Chưa cập nhật'}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="mt-0.5 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ngày sinh</p>
                <p>{user.dateOfBirth || 'Chưa cập nhật'}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <User2 className="mt-0.5 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Giới tính</p>
                <p>{user.gender || 'Chưa cập nhật'}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Briefcase className="mt-0.5 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Nghề nghiệp</p>
                <p>{user.profession || 'Chưa cập nhật'}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Building className="mt-0.5 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Nơi làm việc</p>
                <p>{user.workplace || 'Chưa cập nhật'}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <BookOpen className="mt-0.5 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Kinh nghiệm</p>
                <p>{user.experience || 'Chưa cập nhật'}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Shield className="mt-0.5 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Vai trò</p>
                <p>ID: {user.roleId || 'Chưa cập nhật'}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <BadgeCheck className="mt-0.5 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">ID Người dùng</p>
                <p className="break-all">{user.id}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 