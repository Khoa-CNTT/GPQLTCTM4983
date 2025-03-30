import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl

  // Cho phép truy cập các tài nguyên tĩnh và API
  if (pathname.startsWith('/_next') || pathname.includes('/api/') || pathname.includes('favicon.ico')) {
    return NextResponse.next()
  }

  // Kiểm tra token
  const token = req.cookies.get('authTokenVerify')
  const hasValidToken = Boolean(token?.value && token.value !== 'undefined' && token.value.length > 0)

  // Xử lý trường hợp người dùng đã đăng nhập cố truy cập trang login
  if (pathname.startsWith('/login') && hasValidToken) {
    return NextResponse.redirect(new URL('/dashboard/', req.url))
  }

  // Xử lý tham số loggedIn
  const isDashboardPath = pathname === '/dashboard' || pathname === '/dashboard/' || pathname.match(/^\/dashboard\/?$/)
  if (isDashboardPath && searchParams.get('loggedIn') === 'true') {
    const url = new URL(req.url)
    url.searchParams.delete('loggedIn')
    return NextResponse.redirect(url)
  }

  // Chuyển hướng người dùng đã đăng nhập từ trang đăng nhập/đăng ký đến dashboard
  if (hasValidToken && (pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up'))) {
    return NextResponse.redirect(new URL('/dashboard/', req.url))
  }

  // Chuyển hướng người dùng chưa đăng nhập đến trang đăng nhập khi cố truy cập dashboard
  if (!hasValidToken && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/sign-in', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)', '/dashboard/:path*', '/sign-in', '/sign-up']
}
