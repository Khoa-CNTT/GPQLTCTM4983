import { NextResponse } from 'next/server'

// Hàm xử lý GET request để chuyển hướng
export async function GET(request) {
  // Lấy URL hiện tại
  const url = new URL(request.url)
  
  // Lấy tham số truy vấn tab nếu có
  const tab = url.searchParams.get('tab')
  
  // Xây dựng URL mới
  let newUrl = new URL('/admin/dashboard/admin-management', url)
  
  // Nếu có tham số tab, thêm vào URL mới
  if (tab) {
    newUrl.searchParams.set('tab', tab)
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