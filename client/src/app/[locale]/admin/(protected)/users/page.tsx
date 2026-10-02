import { getUsers } from '@/actions/user';
import UserActions from '@/components/admin/UserActions';

export const metadata = {
  title: 'Customers CMS | Admin',
};

export default async function AdminCustomersPage() {
  const result = await getUsers();

  if (!result.success) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <h1 className="text-3xl font-extrabold text-white mb-4">Customers CMS</h1>
        <div className="bg-red-950/20 text-red-500 p-4 rounded border border-red-900">
          Failed to load users: {result.error}
        </div>
      </div>
    );
  }

  const users = result.data || [];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Customers CMS</h1>
          <p className="text-gray-400 mt-2">Manage user profiles, permissions, and view purchase history.</p>
        </div>
        <div className="bg-[#18181b] px-4 py-2 rounded-lg border border-gray-800 text-gray-300 shadow-md">
          <span className="font-bold text-white">{users.length}</span> Total Users
        </div>
      </div>

      <div className="bg-[#18181b] rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.6)] overflow-x-auto border border-red-950">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-800 bg-gradient-to-r from-red-950/40 to-transparent">
              <th className="p-4 font-semibold text-gray-300">Customer ID</th>
              <th className="p-4 font-semibold text-gray-300">Name</th>
              <th className="p-4 font-semibold text-gray-300">Email</th>
              <th className="p-4 font-semibold text-gray-300">Role</th>
              <th className="p-4 font-semibold text-gray-300">Orders</th>
              <th className="p-4 font-semibold text-gray-300">Total Spent</th>
              <th className="p-4 font-semibold text-gray-300">Join Date</th>
              <th className="p-4 font-semibold text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-400">
            {users.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((cust: any) => (
                <tr key={cust._id} className="border-b border-gray-800/50 hover:bg-gray-900/50 transition-colors">
                  <td className="p-4 text-xs font-mono text-gray-500">
                    {cust._id.substring(cust._id.length - 6)}
                  </td>
                  <td className="p-4 font-medium text-gray-100">{cust.name}</td>
                  <td className="p-4">{cust.email}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider
                      ${cust.role === 'ADMIN' ? 'bg-red-900/30 text-red-400 border border-red-800/50' : 
                        cust.role === 'WHOLESALE' ? 'bg-purple-900/30 text-purple-400 border border-purple-800/50' : 
                        cust.role === 'BANNED' ? 'bg-gray-900 text-gray-500 border border-gray-700' :
                        'bg-blue-900/30 text-blue-400 border border-blue-800/50'}`}>
                      {cust.role}
                    </span>
                  </td>
                  <td className="p-4">{cust.orders}</td>
                  <td className="p-4 font-bold text-red-500">${cust.totalSpent.toFixed(2)}</td>
                  <td className="p-4 text-sm">{cust.joinDate}</td>
                  <td className="p-4">
                    <UserActions userId={cust._id} currentRole={cust.role} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
