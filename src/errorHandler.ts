// errorHandler.ts
import { toast } from 'react-hot-toast' // Giả sử sử dụng react-toastify cho thông báo
import { AxiosError } from 'axios'

// Định nghĩa các loại lỗi có thể gặp phải
export enum ErrorType {
  NETWORK = 'NETWORK',
  SERVER = 'SERVER',
  VALIDATION = 'VALIDATION',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  NOT_FOUND = 'NOT_FOUND',
  TIMEOUT = 'TIMEOUT',
  UNKNOWN = 'UNKNOWN'
}

// Định nghĩa giao diện cho lỗi đã được chuẩn hóa
export interface NormalizedError {
  type: ErrorType
  message: string
  statusCode?: number
  details?: any
  originalError?: any
}

/**
 * Hàm chuyển đổi lỗi từ nhiều nguồn thành định dạng chuẩn hóa
 */
export const normalizeError = (error: any): NormalizedError => {
  // Xử lý lỗi Axios
  if (error instanceof AxiosError) {
    const statusCode = error.response?.status
    const responseData = error.response?.data

    // Phân loại lỗi dựa trên mã trạng thái HTTP
    if (!statusCode || !error.response) {
      return {
        type: ErrorType.NETWORK,
        message: 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng của bạn.',
        originalError: error
      }
    }

    // Trích xuất thông báo lỗi từ định dạng lỗi cụ thể của backend
    // { "timestamp": "2025-05-20T15:15:05.026Z", "messages": "name must be longer than or equal to 1 characters" }
    let errorMessage = 'Đã xảy ra lỗi không xác định.'

    if (responseData) {
      if (typeof responseData.messages === 'string') {
        // Trường hợp messages là chuỗi đơn
        errorMessage = responseData.messages
      } else if (Array.isArray(responseData.messages)) {
        // Trường hợp messages là mảng
        errorMessage = responseData.messages.join(', ')
      } else if (responseData.message) {
        // Trường hợp dùng key 'message' thay vì 'messages'
        errorMessage = responseData.message
      }
    }

    if (statusCode === 401) {
      return {
        type: ErrorType.AUTHENTICATION,
        message: errorMessage || 'Phiên đăng nhập của bạn đã hết hạn. Vui lòng đăng nhập lại.',
        statusCode,
        details: responseData,
        originalError: error
      }
    }

    if (statusCode === 403) {
      return {
        type: ErrorType.AUTHORIZATION,
        message: errorMessage || 'Bạn không có quyền truy cập vào tài nguyên này.',
        statusCode,
        details: responseData,
        originalError: error
      }
    }

    if (statusCode === 404) {
      return {
        type: ErrorType.NOT_FOUND,
        message: errorMessage || 'Không tìm thấy tài nguyên yêu cầu.',
        statusCode,
        details: responseData,
        originalError: error
      }
    }

    if (statusCode === 422 || statusCode === 400) {
      return {
        type: ErrorType.VALIDATION,
        message: errorMessage || 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin của bạn.',
        statusCode,
        details: responseData,
        originalError: error
      }
    }

    if (statusCode >= 500) {
      return {
        type: ErrorType.SERVER,
        message: errorMessage || 'Máy chủ gặp sự cố. Vui lòng thử lại sau.',
        statusCode,
        details: responseData,
        originalError: error
      }
    }

    // Các lỗi HTTP khác
    return {
      type: ErrorType.UNKNOWN,
      message: errorMessage,
      statusCode,
      details: responseData,
      originalError: error
    }
  }

  // Xử lý lỗi timeout
  if (error.code === 'ECONNABORTED') {
    return {
      type: ErrorType.TIMEOUT,
      message: 'Yêu cầu đã hết thời gian chờ. Vui lòng thử lại.',
      originalError: error
    }
  }

  // Xử lý các lỗi khác
  return {
    type: ErrorType.UNKNOWN,
    message: error.message || 'Đã xảy ra lỗi không xác định.',
    originalError: error
  }
}

/**
 * Hàm xử lý lỗi chính để sử dụng trong Tanstack Query
 */
export const handleQueryError = (error: any, retry?: () => void) => {
  const normalizedError = normalizeError(error)

  // Log lỗi cho mục đích gỡ lỗi
  console.error('Query Error:', normalizedError)

  // Xử lý các loại lỗi khác nhau
  switch (normalizedError.type) {
    case ErrorType.AUTHENTICATION:
      // Đăng xuất người dùng hoặc chuyển hướng đến trang đăng nhập
      toast.error(normalizedError.message)
      // localStorage.removeItem('auth_token');
      // window.location.href = '/login';
      break

    case ErrorType.VALIDATION:
      // Hiển thị lỗi validation cụ thể nếu có
      if (normalizedError.details?.errors) {
        const validationErrors = normalizedError.details.errors
        Object.values(validationErrors).forEach((message: any) => {
          toast.error(message)
        })
      } else {
        toast.error(normalizedError.message)
      }
      break

    // case ErrorType.NETWORK:
    // case ErrorType.TIMEOUT:
    //   // Hiển thị thông báo với tùy chọn thử lại
    //   toast.error(
    //     <div>
    //       {normalizedError.message}
    //       {retry && (
    //         <button
    //           onClick={retry}
    //           className="ml-2 bg-blue-500 text-white px-2 py-1 rounded text-sm"
    //         >
    //           Thử lại
    //         </button>
    //       )}
    //     </div>
    //   );
    // break

    default:
      // Xử lý các lỗi khác
      toast.error(normalizedError.message)
  }

  return normalizedError
}

/**
 * Hook để tạo cấu hình mặc định cho Tanstack Query
 */
export const useDefaultQueryOptions = () => {
  return {
    retry: (failureCount: number, error: any) => {
      const normalizedError = normalizeError(error)

      // Không thử lại các lỗi xác thực, ủy quyền và validation
      if (
        normalizedError.type === ErrorType.AUTHENTICATION ||
        normalizedError.type === ErrorType.AUTHORIZATION ||
        normalizedError.type === ErrorType.VALIDATION ||
        normalizedError.type === ErrorType.NOT_FOUND
      ) {
        return false
      }

      // Thử lại tối đa 3 lần cho các lỗi mạng và máy chủ
      return failureCount < 3
    },
    onError: (error: any) => {
      handleQueryError(error)
    }
  }
}

/**
 * Ví dụ cách sử dụng với Tanstack Query
 */
// import { useQuery, QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { useDefaultQueryOptions, handleQueryError } from './errorHandler';

// // Tạo QueryClient với cấu hình mặc định
// const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       retry: (failureCount, error) => {
//         const normalizedError = normalizeError(error);
//         // Tương tự như trong useDefaultQueryOptions
//         // ...
//         return failureCount < 3;
//       },
//     },
//   },
// });

// // Trong component
// const YourComponent = () => {
//   const defaultOptions = useDefaultQueryOptions();
//
//   const { data, isLoading } = useQuery({
//     queryKey: ['your-data'],
//     queryFn: fetchYourData,
//     ...defaultOptions,
//     onError: (error) => {
//       // Xử lý lỗi cụ thể cho query này
//       handleQueryError(error, () => {
//         // Hàm thử lại
//         queryClient.invalidateQueries({ queryKey: ['your-data'] });
//       });
//     },
//   });
//
//   // ...
// };
