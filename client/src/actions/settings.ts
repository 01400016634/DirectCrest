'use server';

import dbConnect from '@/lib/mongoose';
import { StoreSetting } from '@/lib/models/StoreSetting';
import { revalidatePath } from 'next/cache';

export async function getSettings() {
  try {
    await dbConnect();
    let settings = await StoreSetting.findOne().lean();
    if (!settings) {
      settings = await StoreSetting.create({});
    }
    return { success: true, settings: JSON.parse(JSON.stringify(settings)) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateSettings(prevState: any, formData: FormData) {
  try {
    await dbConnect();
    const data = {
      storeName: formData.get('storeName'),
      supportEmail: formData.get('supportEmail'),
      standardShippingCost: Number(formData.get('standardShippingCost')),
      urgentShippingCost: Number(formData.get('urgentShippingCost')),
      enableInternational: formData.get('enableInternational') === 'on',
      minimumUpfrontPercent: Number(formData.get('minimumUpfrontPercent')),
      aboutUsText: formData.get('aboutUsText'),
      navbarLinks: formData.get('navbarLinks'),
    };

    let settings = await StoreSetting.findOne();
    if (!settings) {
      await StoreSetting.create(data);
    } else {
      await StoreSetting.updateOne({}, data);
    }

    revalidatePath('/admin/settings');
    return { success: true, message: 'Settings saved successfully' };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
