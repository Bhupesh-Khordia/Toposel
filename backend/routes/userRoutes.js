import express from "express";

import { loginUser, registerUser, searchUserEmail, searchUserUsername } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/search/email', searchUserEmail);
userRouter.post('/search/username', searchUserUsername);

export default userRouter;