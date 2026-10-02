import type { Response } from 'express';
import type { AuthRequest } from '../middleware/auth.js';
import { User, Address } from '../models/Schema.js';
import { checkOwnershipOrRole } from '../utils/security.js';

// @desc    Get current user profile
// @route   GET /api/users/profile
// @access  Private (CUSTOMER, etc)
export const getMyProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user._id).select('-passwordHash').populate('roleId');
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private (Owner or ADMIN/SUPER_ADMIN/SUPPORT_AGENT)
export const getUserById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // IDOR Protection Check
    const hasAccess = checkOwnershipOrRole(req, req.params.id as string, ['SUPER_ADMIN', 'ADMIN', 'SUPPORT_AGENT']);
    if (!hasAccess) {
      res.status(403).json({ error: 'Not authorized to access this user profile (IDOR prevented)' });
      return;
    }

    const user = await User.findById(req.params.id).select('-passwordHash').populate('roleId');
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Update user (e.g. role escalation check)
// @route   PUT /api/users/:id
// @access  Private (Owner or ADMIN/SUPER_ADMIN)
export const updateUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // 1. IDOR Check
    const hasAccess = checkOwnershipOrRole(req, req.params.id as string, ['SUPER_ADMIN', 'ADMIN']);
    if (!hasAccess) {
      res.status(403).json({ error: 'Not authorized to update this user' });
      return;
    }

    const { roleId, ...updateData } = req.body;
    const currentUserRole = (req.user.roleId as any)?.name;

    // 2. Role Escalation Protection: Only SUPER_ADMIN can change roles.
    // If a regular user or basic ADMIN tries to inject a roleId, block it or ignore it.
    if (roleId && currentUserRole !== 'SUPER_ADMIN') {
      res.status(403).json({ error: 'Role escalation prevented. Only SUPER_ADMIN can modify roles.' });
      return;
    }

    // Prepare safe updates
    const safeUpdates: any = { ...updateData };
    if (roleId && currentUserRole === 'SUPER_ADMIN') {
      safeUpdates.roleId = roleId;
    }

    const user = await User.findByIdAndUpdate(req.params.id, safeUpdates, { new: true, runValidators: true }).select('-passwordHash');
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
