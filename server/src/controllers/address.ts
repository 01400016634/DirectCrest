import type { Request, Response } from 'express';
import { Address, Country } from '../models/Schema.js';

export const getAddresses = async (req: Request, res: Response) => {
  try {
    const addresses = await Address.find({ userId: req.user.id }).populate('countryId');
    res.json(addresses);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getAddressById = async (req: Request, res: Response) => {
  try {
    const address = await Address.findOne({ _id: req.params.id, userId: req.user.id }).populate('countryId');
    if (!address) return res.status(404).json({ error: 'Address not found' });
    res.json(address);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createAddress = async (req: Request, res: Response) => {
  try {
    const { label, countryId, phone, level1, level2, level3, postalCode, street, isDefault } = req.body;
    
    // Country-aware validation
    const country = await Country.findById(countryId);
    if (!country) return res.status(404).json({ error: 'Country not found' });
    
    const errors: string[] = [];
    if (country.code === 'BD') {
      if (!level1) errors.push('Division is required');
      if (!level2) errors.push('District is required');
      if (!level3) errors.push('Upazila is required');
      if (!postalCode) errors.push('Postal Code is required');
    } else if (country.code === 'IN') {
      if (!level1) errors.push('State is required');
      if (!level2) errors.push('District is required');
      if (!postalCode) errors.push('PIN is required');
    } else if (country.code === 'PK') {
      if (!level1) errors.push('Province is required');
      if (!level2) errors.push('City is required');
      if (!postalCode) errors.push('Postal Code is required');
    }

    if (errors.length > 0) return res.status(400).json({ error: errors.join(', ') });

    // Handle default address logic
    if (isDefault) {
      await Address.updateMany({ userId: req.user.id }, { isDefault: false });
    } else {
      const existing = await Address.countDocuments({ userId: req.user.id });
      if (existing === 0) req.body.isDefault = true; // First address is default
    }

    const address = new Address({
      userId: req.user.id,
      label,
      countryId,
      phone,
      level1,
      level2,
      level3,
      postalCode,
      street,
      isDefault: req.body.isDefault || isDefault
    });

    await address.save();
    res.status(201).json(address);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const updateAddress = async (req: Request, res: Response) => {
  try {
    const { label, countryId, phone, level1, level2, level3, postalCode, street, isDefault } = req.body;
    
    const address = await Address.findOne({ _id: req.params.id, userId: req.user.id });
    if (!address) return res.status(404).json({ error: 'Address not found' });
    
    let currentCountryId = address.countryId;
    if (countryId && countryId !== address.countryId.toString()) {
      currentCountryId = countryId;
    }

    const country = await Country.findById(currentCountryId);
    if (!country) return res.status(404).json({ error: 'Country not found' });

    const errors: string[] = [];
    const checkL1 = level1 !== undefined ? level1 : address.level1;
    const checkL2 = level2 !== undefined ? level2 : address.level2;
    const checkL3 = level3 !== undefined ? level3 : address.level3;
    const checkZip = postalCode !== undefined ? postalCode : address.postalCode;

    if (country.code === 'BD') {
      if (!checkL1) errors.push('Division is required');
      if (!checkL2) errors.push('District is required');
      if (!checkL3) errors.push('Upazila is required');
      if (!checkZip) errors.push('Postal Code is required');
    } else if (country.code === 'IN') {
      if (!checkL1) errors.push('State is required');
      if (!checkL2) errors.push('District is required');
      if (!checkZip) errors.push('PIN is required');
    } else if (country.code === 'PK') {
      if (!checkL1) errors.push('Province is required');
      if (!checkL2) errors.push('City is required');
      if (!checkZip) errors.push('Postal Code is required');
    }

    if (errors.length > 0) return res.status(400).json({ error: errors.join(', ') });

    if (isDefault) {
      await Address.updateMany({ userId: req.user.id }, { isDefault: false });
    }

    const updated = await Address.findByIdAndUpdate(
      req.params.id,
      { label, countryId, phone, level1, level2, level3, postalCode, street, isDefault },
      { new: true }
    );
    
    res.json(updated);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteAddress = async (req: Request, res: Response) => {
  try {
    const address = await Address.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!address) return res.status(404).json({ error: 'Address not found' });
    
    if (address.isDefault) {
      // Set another address as default
      const remaining = await Address.findOne({ userId: req.user.id });
      if (remaining) {
        remaining.isDefault = true;
        await remaining.save();
      }
    }
    
    res.json({ message: 'Address deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
