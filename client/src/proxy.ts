

import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createIntlMiddleware(routing);

async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  
  // Skip next-intl for API routes and /intro
  if (pathname.startsWith('/api/') || pathname.startsWith('/intro')) {
    return NextResponse.next();
  }
  
  // Check if it's an admin route, but not the login page
  const isAdminRoute = /\/(en|bn|zh|ja)\/admin/.test(pathname) && !/\/(en|bn|zh|ja)\/admin\/login/.test(pathname);
  
  if (isAdminRoute) {
    const adminToken = req.cookies.get('admin_token')?.value;
    
    if (adminToken !== 'secure-admin-session-token') {
      const locale = pathname.split('/')[1] || 'en';
      const url = req.nextUrl.clone();
      url.pathname = `/${locale}/admin/login`;
      return NextResponse.redirect(url);
    }
  }

  return intlMiddleware(req);
}
 
export async function proxy(req: NextRequest) {
  return middleware(req);
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|glb|gltf|bin)).*)",
    "/(api|trpc)(.*)",
  ],
};
