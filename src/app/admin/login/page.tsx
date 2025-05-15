import AdminLoginForm from './form'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Đăng nhập quản trị - UNIKO',
  description: 'Trang đăng nhập dành cho quản trị viên'
}

export default function AdminLoginPage() {
  return (
    <div>
      <AdminLoginForm></AdminLoginForm>
    </div>
  )
} 