import express from "express"
import {  userLogin, principalLogin } from '../controllers/authController.js';
import { userLoginValidation } from '../middlewares/authValidation.js';

const authRouter = express.Router()

authRouter.post('/user-login', userLoginValidation, userLogin);
authRouter.post('/principal-login', userLoginValidation, principalLogin);

export default authRouter;