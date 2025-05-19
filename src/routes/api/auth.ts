import express from 'express'
var router = express.Router();
import authRoute from '../../controller/api/authController';
import authenticate from '../../middleware/authMiddleware';

router.post('/register', authRoute.register);
router.post('/login', authRoute.login);
router.post('/forgot-password', authRoute.forgotPasswordSendEmail);
router.get('/forgot-password/:token', authRoute.forgotPasswordVerifyToken);
router.patch('/forgot-password/:token', authRoute.forgotPasswordChangePassword);
router.get('/verify/:token', authRoute.verify);
router.post('/re-send-email-activation/:token', authRoute.resendEmailVerification);
router.get('/refresh-token', authRoute.refreshToken);
router.get('/logout', authenticate, authRoute.logout);

export default router