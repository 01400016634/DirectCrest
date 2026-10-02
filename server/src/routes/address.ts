import express from 'express';
import { protect } from '../middleware/auth.js';
import { 
  getAddresses, 
  getAddressById, 
  createAddress, 
  updateAddress, 
  deleteAddress 
} from '../controllers/address.js';

const router = express.Router();

router.use(protect); // All address routes require authentication

router.get('/', getAddresses);
router.get('/:id', getAddressById);
router.post('/', createAddress);
router.put('/:id', updateAddress);
router.delete('/:id', deleteAddress);

export default router;
