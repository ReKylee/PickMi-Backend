import { NextFunction, Request, Response } from 'express';
import { ForgottenPasswordHandler } from '../../../Application/Users/forgottenPassword.js';
import { SignIn } from '../../../Application/Users/signIn.js';
import { SignUp } from '../../../Application/Users/signUp.js';
import { ResetPassword } from '../../../Application/Users/resetPassword.js';
import { DeleteAccountHandler } from '../../../Application/Users/deleteAccount.js';
import { ValidationError } from '../../../Shared/Errors.js';
import { AuthenticatedRequest } from '../../../Shared/Middlewares/authMiddleware.js';

export class UserController {
    constructor(
        private readonly signUpUseCase: SignUp,
        private readonly signInUseCase: SignIn,
        private readonly forgotPasswordUseCase: ForgottenPasswordHandler,
        private readonly resetPasswordUseCase: ResetPassword,
        private readonly deleteAccountUseCase: DeleteAccountHandler,
    ) {}

    public signUp = async (req: Request, res: Response, next: NextFunction) => {
        const { email, password } = req.body;

        const result = await this.signUpUseCase
            .execute({ email, password })
            .map(() => ({
                message: 'User created successfully. Please sign in.',
            }));

        result.match(
            (response) => res.status(201).json(response),
            (error) => next(error),
        );
    };

    public signIn = async (req: Request, res: Response, next: NextFunction) => {
        const { email, password } = req.body;

        const result = await this.signInUseCase.execute({ email, password });

        result.match(
            (response) => res.status(200).json(response),
            (error) => next(error),
        );
    };

    public forgotPassword = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        const { email } = req.body;

        const result = await this.forgotPasswordUseCase
            .handle(email)
            .map(() => ({
                message:
                    'If an account with that email exists, a password reset link has been sent.',
            }));

        result.match(
            (response) => res.status(200).json(response),
            (error) => {
                // Always respond with success to prevent email enumeration
                if (error instanceof ValidationError) {
                    return next(error); // let validation errors propagate
                }

                // Log other errors for observability but still return success
                console.error('Forgot password error:', error);
                return res.status(200).json({
                    message:
                        'If an account with that email exists, a password reset link has been sent.',
                });
            },
        );
    };
    public resetPassword = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        const { token, newPassword } = req.body;

        const result = await this.resetPasswordUseCase
            .execute({ token, newPassword })
            .map(() => ({
                message:
                    'Password has been reset successfully. Please sign in.',
            }));

        result.match(
            (response) => res.status(200).json(response),
            (error) => next(error),
        );
    };

    public deleteAccount = async (
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction,
    ) => {
        const userId = req.user?.id;
        const { password } = req.body;

        if (!userId) {
            return next(new Error('User not authenticated'));
        }

        const result = await this.deleteAccountUseCase
            .execute({ userId, password })
            .map(() => ({
                message: 'Account deleted successfully.',
            }));

        result.match(
            (response) => res.status(200).json(response),
            (error) => next(error),
        );
    };
}
