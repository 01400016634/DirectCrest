import express from 'express';
import { getMyProfile, getUserById, updateUser } from '../controllers/user.controller.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All user routes require authentication
router.use(protect);

// Customer accessing their own profile
router.get('/profile', getMyProfile);

// Dynamic user routes with IDOR and Role Escalation protection built-in
router.route('/:id')
  .get(getUserById)
  .put(updateUser);

// Example of a strict admin-only route
router.delete('/:id', authorize('SUPER_ADMIN'), (req, res) => {
  res.status(200).json({ success: true, message: 'User deleted via SUPER_ADMIN' });
});

export default router;
