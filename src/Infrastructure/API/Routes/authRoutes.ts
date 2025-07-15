import { Router } from 'express';
import { authMiddleware } from '../../../Shared/Middlewares/authMiddleware.js';
import { UserController } from '../Controllers/userController.js';

// Import use cases
import { SignUp } from '../../../Application/Users/signUp.js';
import { SignIn } from '../../../Application/Users/signIn.js';
import { ForgottenPasswordHandler } from '../../../Application/Users/forgottenPassword.js';
import { ResetPasswordHandler } from '../../../Application/Users/resetPassword.js';
import { DeleteAccountHandler } from '../../../Application/Users/deleteAccount.js';

// Import repositories and services
import {
    appBaseUrl,
    authService,
    emailService,
    noteRepository,
    userRepository,
} from '../../../Shared/services.js';

const authRouter = Router();

// Create use case instances
const signUpUseCase = new SignUp(userRepository, authService);
const signInUseCase = new SignIn(userRepository, authService);
const forgotPasswordUseCase = new ForgottenPasswordHandler(
    userRepository,
    emailService,
    appBaseUrl,
);
const resetPasswordUseCase = new ResetPasswordHandler(userRepository);
const deleteAccountUseCase = new DeleteAccountHandler(
    userRepository,
    noteRepository,
);

const userController = new UserController(
    signUpUseCase,
    signInUseCase,
    forgotPasswordUseCase,
    resetPasswordUseCase,
    deleteAccountUseCase,
);

// Routes
authRouter.post('/signup', userController.signUp);
authRouter.post('/signin', userController.signIn);
authRouter.post('/reset-password', userController.resetPassword);
authRouter.post('/forgot-password', userController.forgotPassword);

// Protected routes
authRouter.delete('/me', authMiddleware, userController.deleteAccount);

export default authRouter;
