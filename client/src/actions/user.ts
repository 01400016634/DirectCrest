'use server';

import dbConnect from '@/lib/mongoose';
import { User, Role, Order } from '@/lib/models/Schema';
import { revalidatePath } from 'next/cache';

export async function getUsers() {
  try {
    await dbConnect();
    
    // Ensure roles exist
    const adminRole = await Role.findOneAndUpdate({ name: 'ADMIN' }, { name: 'ADMIN' }, { upsert: true, returnDocument: 'after' });
    const wholesaleRole = await Role.findOneAndUpdate({ name: 'WHOLESALE' }, { name: 'WHOLESALE' }, { upsert: true, returnDocument: 'after' });
    const userRole = await Role.findOneAndUpdate({ name: 'USER' }, { name: 'USER' }, { upsert: true, returnDocument: 'after' });

    const users = await User.find().populate('roleId').sort({ createdAt: -1 }).lean();
    
    // For each user, fetch their order count and total spent
    const usersWithStats = await Promise.all(users.map(async (user: any) => {
      const orders = await Order.find({ userId: user._id }).lean();
      const totalSpent = orders.reduce((sum, order: any) => sum + (order.total || 0), 0);
      
      return {
        _id: user._id.toString(),
        name: (user.firstName || '') + ' ' + (user.lastName || '') || 'Unknown',
        email: user.email,
        role: user.roleId?.name || 'USER',
        orders: orders.length,
        totalSpent,
        joinDate: new Date(user.createdAt).toLocaleDateString()
      };
    }));

    return { success: true, data: JSON.parse(JSON.stringify(usersWithStats)) };
  } catch (error: any) {
    console.error('Failed to get users:', error);
    return { success: false, error: error.message };
  }
}

export async function updateUserRole(userId: string, newRoleName: string) {
  try {
    await dbConnect();
    const role = await Role.findOne({ name: newRoleName });
    if (!role) throw new Error('Role not found');
    
    await User.findByIdAndUpdate(userId, { roleId: role._id });
    revalidatePath('/[locale]/admin/users', 'page');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function banUser(userId: string) {
  try {
    await dbConnect();
    // In a real system, you might have a 'isBanned' field. Let's just set their role to 'BANNED'
    const bannedRole = await Role.findOneAndUpdate({ name: 'BANNED' }, { name: 'BANNED' }, { upsert: true, returnDocument: 'after' });
    await User.findByIdAndUpdate(userId, { roleId: bannedRole._id });
    revalidatePath('/[locale]/admin/users', 'page');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
