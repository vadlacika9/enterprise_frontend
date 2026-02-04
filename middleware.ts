import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 1. Kiolvassuk a tokent a sütikből
  const token = request.cookies.get('auth-token')?.value;
  
  const { pathname } = request.nextUrl;

  // 2. HA NINCS TOKEN és a védett oldalra (pl. /foglalasok) akar menni
  if (!token && pathname.startsWith('/foglalasok')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 3. HA VAN TOKEN és a loginra vagy registerre akar menni
  if (token && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/foglalasok', request.url));
  }

  return NextResponse.next();
}

// Opcionális: Megadhatod, mely útvonalakon fusson le a middleware
export const config = {
  matcher: ['/foglalasok/:path*', '/login', '/register'],
};