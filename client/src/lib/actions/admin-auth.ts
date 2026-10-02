'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function loginAdmin(prevState: unknown, formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;
  const locale = formData.get('locale') as string || 'en';

  if (username === 'admin' && password === 'admin123') {
    const cookieStore = await cookies();
    cookieStore.set('admin_token', 'secure-admin-session-token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });
    
    redirect(`/${locale}/admin/dashboard`);
  }

  return { error: 'Invalid username or password' };
}

export async function logoutAdmin(locale: string = 'en') {
  const cookieStore = await cookies();
  cookieStore.delete('admin_token');
  redirect(`/${locale}/admin/login`);
}
