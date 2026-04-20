import { Router } from 'express';
import { registerUser, loginUser } from './task.controller';
import { validateRegister, validateLogin } from './task.validation';

const router = Router();

router.post('/register', validateRegister, registerUser);
router.post('/login', validateLogin, loginUser);

export default router;