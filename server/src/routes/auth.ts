import express from 'express';
import { 
  register, 
  login, 
  googleAuthCallback, 
  forgotPassword, 
  resetPassword,
  requestOtp
} from '../controllers/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleAuthCallback);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);
router.post('/request-otp', requestOtp);

export default router;
