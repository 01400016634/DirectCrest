'use server';

import dbConnect from '@/lib/mongoose';
import { ShippingZone, ShippingRate } from '@/lib/models/Schema';

export async function calculateShippingRateAction(countryCode: string, totalWeight: number) {
  try {
    await dbConnect();

    // Find zone containing this country
    const zone = await ShippingZone.findOne({ countries: countryCode }).lean();
    
    if (!zone) {
      // Default fallback if no zone matches
      return { cost: 25.00, method: 'Standard International' };
    }

    // Find rates for this zone
    const rates = await ShippingRate.find({ zoneId: zone._id }).lean();
    if (!rates || rates.length === 0) {
      return { cost: 15.00, method: 'Standard Shipping' };
    }

    // Check for WEIGHT based
    const weightRates = rates.filter(r => r.rateType === 'WEIGHT');
    if (weightRates.length > 0) {
      // Find the correct tier
      const applicableRate = weightRates.find(r => 
        totalWeight >= (r.minWeight || 0) && 
        totalWeight <= (r.maxWeight || Number.MAX_SAFE_INTEGER)
      );
      
      if (applicableRate) {
        return { cost: applicableRate.rate, method: applicableRate.methodName || 'Weight-based Shipping' };
      }
      
      // If weight exceeds highest tier, use highest
      const highestRate = weightRates.reduce((prev, current) => (prev.maxWeight || 0) > (current.maxWeight || 0) ? prev : current);
      return { cost: highestRate.rate, method: highestRate.methodName || 'Heavy Package Shipping' };
    }

    // Check for FLAT rate if no weight rates
    const flatRate = rates.find(r => r.rateType === 'FLAT');
    if (flatRate) {
      return { cost: flatRate.rate, method: flatRate.methodName || 'Flat Rate' };
    }

    return { cost: 15.00, method: 'Standard Shipping' };

  } catch (error) {
    console.error('Error calculating shipping:', error);
    return { cost: 20.00, method: 'Fallback Shipping' };
  }
}
