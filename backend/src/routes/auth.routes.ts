import { Router } from 'express';
import { localSignup, localLogin, verifyEmail, googleCallback } from '../controllers/auth.controller';
import passport from '../utils/passportSetup';

const authRouter = Router();

// Local Auth
authRouter.post('/signup', localSignup);
authRouter.post('/login', localLogin);
authRouter.get('/verify-email', verifyEmail);

// Google Auth
authRouter.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
authRouter.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), googleCallback);

export default authRouter;