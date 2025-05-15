import axios, { AxiosError, AxiosRequestConfig } from 'axios'
import configProject from '@/config/configService'
import {
  getAccessTokenFromLocalStorage,
  removeTokensFromLocalStorage,
  setAccessTokenToLocalStorage,
  setRefreshTokenToLocalStorage
} from '@/libraries/helpers'
import { normalizePath } from '@/libraries/utils'
import { IMutateData } from '@/types/common.i'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import i18n from 'i18next'
import Cookies from 'js-cookie'

export class HttpError extends Error {
  status: number
  payload: Record<string, any>

  constructor({
    status,
    payload,
    message = 'HTTP Error'
  }: {
    status: number
    payload: Record<string, any>
    message?: string
  }) {
    super(message)
    this.status = status
    this.payload = payload
  }
}

const isClient = typeof window !== 'undefined'

const axiosInstance = axios.create({
  baseURL: configProject.NEXT_PUBLIC_API_ENDPOINT,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
})

// Thêm biến để kiểm soát việc chuyển hướng
let isRedirecting = false
// Thêm biến để theo dõi nếu đã thử refresh token
let hasAttemptedTokenRefresh = false

// Hàm xóa tất cả thông tin phiên đăng nhập
const clearAllAuthData = () => {
  // Xóa tokens từ localStorage
  removeTokensFromLocalStorage()
  // Xóa cookie xác thực
  Cookies.remove('authTokenVerify', { path: '/' })
  // Xóa các cookie liên quan khác nếu có
  Cookies.remove('next-auth.session-token', { path: '/' })
  Cookies.remove('next-auth.csrf-token', { path: '/' })
  Cookies.remove('next-auth.callback-url', { path: '/' })
}

// Hàm reset trạng thái refresh token
const resetTokenRefreshState = () => {
  hasAttemptedTokenRefresh = false
}

// Thêm hàm này vào export để có thể reset trạng thái khi cần
export const resetAuthState = () => {
  isRedirecting = false
  resetTokenRefreshState()
}

axiosInstance.interceptors.request.use((config) => {
  if (isClient) {
    const currentLanguage = i18n.language || 'vi'
    const accessToken = getAccessTokenFromLocalStorage()
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    config.headers['Accept-Language'] = currentLanguage
  }
  return config
})

axiosInstance.interceptors.response.use(
  (response) => {
    // Reset trạng thái refresh token khi request thành công
    if (response.status >= 200 && response.status < 300) {
      resetTokenRefreshState()
    }
    return response
  },
  async (error: AxiosError) => {
    const { response } = error

    // Kiểm tra nếu lỗi là do token hết hạn
    if (response?.status === 401 ||
      (response?.data && (response?.data as any).errorCode === 112)) {

      // Kiểm tra xem request hiện tại có phải là request verify-token không
      const originalRequest = error.config as AxiosRequestConfig
      if (originalRequest && !originalRequest.url?.includes('auth/verify-token') && !hasAttemptedTokenRefresh) {
        try {
          hasAttemptedTokenRefresh = true

          const refreshResponse = await axiosInstance.get('auth/verify-token/')

          if (refreshResponse.data && refreshResponse.data.data && refreshResponse.data.data.accessToken) {
            const { accessToken } = refreshResponse.data.data

            setAccessTokenToLocalStorage(accessToken)

            if (!originalRequest.headers) {
              originalRequest.headers = {}
            }
            originalRequest.headers = {
              ...originalRequest.headers,
              Authorization: `Bearer ${accessToken}`
            }

            return axiosInstance(originalRequest)
          }
        } catch (refreshError) {

        }
      } else {
        // Nếu chính API verify-token trả về lỗi hoặc đã thử refresh token trước đó
        // hoặc là request verify-token, chuyển hướng đến trang đăng nhập
        if (window.location.pathname !== '/sign-in' && !isRedirecting) {
          isRedirecting = true
          clearAllAuthData()
          // Hiển thị thông báo lỗi
          toast.error('Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.')
          // Chuyển hướng đến trang đăng nhập sau một khoảng thời gian nhỏ
          setTimeout(() => {
            window.location.replace('/sign-in')
          }, 100)
        }
      }
    }

    return Promise.reject(
      new HttpError({
        status: response?.status || 0,
        payload: response?.data || {},
        message: error.message
      })
    )
  }
)

const request = async <TResponseponse>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
  url: string,
  options?: AxiosRequestConfig,
  headers?: Record<string, string>
): Promise<{ status: number; payload: TResponseponse }> => {
  const fullUrl = normalizePath(url)
  const response = await axiosInstance.request<TResponseponse>({
    url: fullUrl,
    method,
    ...options,
    headers
  })

  const { data, status } = response

  if (isClient) {
    handleClientSideActions(fullUrl, data)
  }

  return { status, payload: data }
}

const handleClientSideActions = (url: string, data: any) => {
  const normalizedUrl = normalizePath(url)
  if (['api/auth/login'].includes(normalizedUrl)) {
    // Xóa token cũ trước khi lưu token mới
    removeTokensFromLocalStorage()
    Cookies.remove('authTokenVerify', { path: '/' })
    Cookies.remove('refreshToken', { path: '/' })

    const { accessToken, refreshToken } = data.data
    setAccessTokenToLocalStorage(accessToken)
    setRefreshTokenToLocalStorage(refreshToken)

    // Reset trạng thái refresh token sau khi đăng nhập thành công
    resetTokenRefreshState()
  } else if (normalizedUrl === 'api/auth/token') {
    // Xóa token cũ trước khi lưu token mới
    removeTokensFromLocalStorage()
    Cookies.remove('authTokenVerify', { path: '/' })
    Cookies.remove('refreshToken', { path: '/' })

    const { accessToken, refreshToken } = data as { accessToken: string; refreshToken: string }
    setAccessTokenToLocalStorage(accessToken)
    setRefreshTokenToLocalStorage(refreshToken)

    // Reset trạng thái refresh token sau khi lấy token mới
    resetTokenRefreshState()
  } else if (['api/auth/logout', 'api/guest/auth/logout'].includes(normalizedUrl)) {
    clearAllAuthData()
    // Reset trạng thái refresh token sau khi đăng xuất
    resetTokenRefreshState()
  }
}

const httpService = {
  get<TResponse>(url: string, options?: AxiosRequestConfig, headers?: Record<string, string>) {
    return request<TResponse>('GET', url, options, headers)
  },
  post<TBody, TResponse>(url: string, body: TBody, options?: AxiosRequestConfig, headers?: Record<string, string>) {
    return request<TResponse>('POST', url, { ...options, data: body }, headers)
  },
  put<TBody, TResponse>(url: string, body: TBody, options?: AxiosRequestConfig, headers?: Record<string, string>) {
    return request<TResponse>('PUT', url, { ...options, data: body }, headers)
  },
  delete<TResponse>(url: string, options?: AxiosRequestConfig, headers?: Record<string, string>) {
    return request<TResponse>('DELETE', url, options, headers)
  },
  patch<TBody, TResponse>(url: string, body: TBody, options?: AxiosRequestConfig, headers?: Record<string, string>) {
    return request<TResponse>('PATCH', url, { ...options, data: body }, headers)
  }
}

export const fetchData = async <TResponse>(
  url: string,
  params: Record<string, any> = {},
  headers?: Record<string, string>
): Promise<TResponse> => {
  const { payload } = await httpService.get<TResponse>(url, { params }, headers)
  return payload
}

export const mutateData = async <TBody, TResponse>(props: IMutateData<TBody>): Promise<TResponse> => {
  const { url, body, params = {}, headers = {}, method = 'post' } = props

  if (method === 'delete') {
    const { payload } = await httpService.delete<TResponse>(url, { params }, headers)
    return payload
  }
  const { payload } = await httpService[method]<TBody, TResponse>(url, body, { params }, headers)
  return payload
}

export default httpService
