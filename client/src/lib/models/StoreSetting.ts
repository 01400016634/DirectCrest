import mongoose, { Schema } from 'mongoose';

const StoreSettingSchema = new Schema({
  storeName: { type: String, default: 'DirectCrest' },
  supportEmail: { type: String, default: 'support@directcrest.com' },
  standardShippingCost: { type: Number, default: 15.00 },
  urgentShippingCost: { type: Number, default: 45.00 },
  enableInternational: { type: Boolean, default: true },
  minimumUpfrontPercent: { type: Number, default: 25 },
  aboutUsText: { type: String, default: 'DirectCrest is a leading B2B platform...' },
  navbarLinks: { type: String, default: 'Products,About,Contact' },
}, { timestamps: true });

export const StoreSetting = mongoose.models.StoreSetting || mongoose.model('StoreSetting', StoreSettingSchema);
