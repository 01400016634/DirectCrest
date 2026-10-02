'use server';

import dbConnect from '@/lib/mongoose';
import { User, Role } from '@/lib/models/Schema';
import { sendEmail } from '@/lib/email';
import WelcomeEmail from '@/emails/WelcomeEmail';
import * as React from 'react';

export async function syncUser(email: string, name: string | null) {
  try {
    await dbConnect();
    let user = await User.findOne({ email });
    if (!user) {
      let firstName = 'User';
      let lastName = '';
      if (name) {
        const parts = name.split(' ');
        firstName = parts[0];
        lastName = parts.slice(1).join(' ');
      }
      
      const userRole = await Role.findOneAndUpdate(
        { name: 'USER' },
        { name: 'USER' },
        { upsert: true, returnDocument: 'after' }
      );
      
      user = await User.create({
        email,
        firstName,
        lastName,
        roleId: userRole?._id
      });
      
      // Send welcome email asynchronously
      sendEmail({
        to: email,
        subject: 'Welcome to DirectCrest!',
        react: React.createElement(WelcomeEmail, { name: firstName })
      }).catch(err => console.error('Failed to send welcome email:', err));
    }
    return { success: true };
  } catch (error: any) {
    console.error('Error syncing user:', error);
    return { success: false, error: error.message };
  }
}
