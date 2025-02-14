import express from 'express';
import { loginUser, registerUser, searchUserEmail, searchUserUsername } from '../controllers/userController.js';
import authUser from '../middleware/auth.js';

const userRouter = express.Router();

userRouter.post('/login', loginUser);
userRouter.post('/register', registerUser);
userRouter.post('/search/email', authUser, searchUserEmail);
userRouter.post('/search/username', authUser, searchUserUsername);

export default userRouter;