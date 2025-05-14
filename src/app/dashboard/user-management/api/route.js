import { NextResponse } from 'next/server'

// Hàm xử lý GET request để chuyển hướng
export async function GET(request) {
  // Lấy URL hiện tại
  const url = new URL(request.url)
  
  // Xây dựng URL mới
  let newUrl = new URL('/admin/dashboard/user-management', url)
  
  // Lấy tham số truy vấn nếu có và thêm vào URL mới
  for (const [key, value] of url.searchParams.entries()) {
    newUrl.searchParams.set(key, value)
  }
  
  // Chuyển hướng tới URL mới
  return NextResponse.redirect(newUrl)
}

// Đảm bảo các phương thức HTTP khác cũng được chuyển hướng
export async function POST(request) {
  return GET(request)
}

export async function PUT(request) {
  return GET(request)
}

export async function DELETE(request) {
  return GET(request)
} 