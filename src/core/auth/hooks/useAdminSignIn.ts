import { setAccessTokenToLocalStorage, setRefreshTokenToLocalStorage } from '@/libraries/helpers'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { authServices } from '../configs'
import { AUTH_RETRY } from '@/core/auth/constants'
import { IUseQueryHookOptions } from '@/types/query.interface'
import { useState } from 'react'
import { useMutationCustom } from '@/hooks/useMutationCustom'
import { ISignInBody, ISignInResponse } from '@/core/auth/models'
import Cookies from 'js-cookie'

export const useAdminSignIn = (isRememberMe: boolean, opts?: IUseQueryHookOptions) => {
  const router = useRouter()
  const [countLogin, setCountLogin] = useState<number>(0)
  
  const mutation = useMutationCustom<ISignInBody, ISignInResponse>({
    pathUrl: authServices.signIn,
    mutateOption: {
      retry: AUTH_RETRY,
      onSuccess: (data) => {
        setCountLogin(countLogin + 1)
        if (data.data.user.status === 'ACTIVE') {
          // Chỉ xử lý chuyển hướng và lưu thông tin nếu có quyền admin
          // Kiểm tra roleId khác null (có quyền admin)
          if (data.data.user.roleId !== null) {
            // Lưu cookie và token
            Cookies.set('authTokenVerify', data.data.accessToken, {
              path: '/',
              secure: true,
              sameSite: 'lax',
              expires: 1
            })
            Cookies.set('refreshToken', data.data.refreshToken, {
              path: '/',
              secure: true,
              sameSite: 'lax',
              expires: 7
            })
            
            // Thêm cookie adminRole để xác thực quyền admin trong middleware
            Cookies.set('adminRole', 'true', {
              path: '/',
              secure: true,
              sameSite: 'lax',
              expires: 1
            })
            
            // Lưu token vào localStorage
            setAccessTokenToLocalStorage(data.data.accessToken)
            setRefreshTokenToLocalStorage(data.data.refreshToken)
            
            // Lưu thông tin người dùng vào localStorage
            localStorage.setItem('user', JSON.stringify(data.data.user))
            
            // Thông báo thành công
            toast.success('Đăng nhập thành công!')
            
            // Chuyển hướng đến dashboard admin
            // Sử dụng callback từ component gọi nếu có, nếu không thì chuyển hướng mặc định
            if (opts?.callBackOnSuccess) {
              opts.callBackOnSuccess()
            } else {
              setTimeout(() => {
                router.push('/admin/dashboard')
              }, 300)
            }
          } else {
            // Người dùng không có quyền admin
            toast.error('Bạn không có quyền truy cập trang quản trị!')
            
            // Xóa token nếu đã được lưu
            Cookies.remove('authTokenVerify', { path: '/' })
            Cookies.remove('refreshToken', { path: '/' })
            Cookies.remove('adminRole', { path: '/' })
          }
        } else if (data.data.user.status === 'UNVERIFY') {
          toast.error('Tài khoản chưa được kích hoạt, vui lòng liên hệ quản trị viên!')
        }
      },
      onError: (error) => {
        const errorMessage =
          (error as any)?.payload?.message + '!\n\n' + (error as any)?.payload?.details[0] ||
          'Đăng nhập thất bại, vui lòng thử lại!'
        toast.error(errorMessage, { duration: 1500 })
        if (opts?.callBackOnError) {
          opts.callBackOnError()
        }
      }
    }
  })

  return mutation
} 