import AccountDashboardClient from '@/components/account/AccountDashboardClient';

export const metadata = {
  title: 'My Account | DirectCrest',
};

export const dynamic = 'force-dynamic';

export default function AccountDashboard() {
  return <AccountDashboardClient />;
}
