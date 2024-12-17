import { Router } from 'express';
import { getUsers } from '../controllers/user.controller';

const authRouter = Router();

authRouter.get('/', getUsers);

export default authRouter;