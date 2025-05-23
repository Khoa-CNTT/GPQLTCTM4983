import { AxiosError } from 'axios'
import toast from 'react-hot-toast'
import { HttpError } from './http'

interface ApiErrorResponse {
  messages?: string | string[]
  errorCode?: number
  errors?: Record<string, string[]>
  statusCode?: number
  error?: string
  message?: string
  details?: string[]
}

export const handleApiError = (error: any) => {
  console.log('Raw error:', error.payload.messages)

  if (error instanceof HttpError) {
    console.log('HttpError payload:', error.payload)
    const errorData = error.payload as ApiErrorResponse

    // Handle NestJS validation errors
    if (errorData.messages && Array.isArray(errorData.messages)) {
      errorData.messages.forEach((messages) => {
        toast.error(messages)
      })
      return
    }

    // Handle validation errors from errors object
    if (errorData.errors) {
      Object.values(errorData.errors).forEach((messages) => {
        messages.forEach((message) => {
          toast.error(message)
        })
      })
      return
    }

    if (errorData.details && errorData.details.length > 0) {
      Object.values(errorData.details).forEach((message) => {
        toast.error(message)
      })
      return
    }

    // Handle single error message
    if (errorData.messages) {
      toast.error(errorData.messages)
      return
    }
  }

  // Handle Axios errors
  if (error instanceof AxiosError) {
    console.log('AxiosError response:', error.response?.data)
    const errorData = error.response?.data as ApiErrorResponse

    // Handle NestJS validation errors
    if (Array.isArray(errorData?.messages)) {
      errorData.messages.forEach((message) => {
        toast.error(message)
      })
      return
    }

    // Handle validation errors from errors object
    if (errorData?.errors) {
      Object.values(errorData.errors).forEach((messages) => {
        messages.forEach((message) => {
          toast.error(message)
        })
      })
      return
    }

    // Handle single error message
    if (errorData?.message) {
      toast.error(errorData.message)
      return
    }
  }

  // Fallback error message
  console.log('No specific error format found, using fallback message')
  toast.error('Đã có lỗi xảy ra. Vui lòng thử lại sau.')
}
