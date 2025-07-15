import { NextFunction, Request, Response } from 'express';
import { ForgottenPasswordHandler } from '../../../Application/Users/forgottenPassword.js';
import { SignIn } from '../../../Application/Users/signIn.js';
import { SignUp } from '../../../Application/Users/signUp.js';
import { ValidationError } from '../../../Shared/Errors.js';

export class UserController {
    constructor(
        private readonly signUpUseCase: SignUp,
        private readonly signInUseCase: SignIn,
        private readonly forgotPasswordUseCase: ForgottenPasswordHandler,
    ) {}

    public signUp = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, password } = req.body;
            const result = await this.signUpUseCase.execute({
                email,
                password,
            });

            if (result.isErr()) {
                return next(result.error);
            }

            return res.status(201).json({
                message: 'User created successfully. Please sign in.',
            });
        } catch (error) {
            next(error);
        }
    };

    public signIn = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, password } = req.body;
            const result = await this.signInUseCase.execute({
                email,
                password,
            });

            if (result.isErr()) {
                return next(result.error);
            }

            return res.status(200).json(result.value);
        } catch (error) {
            next(error);
        }
    };

    public forgotPassword = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        const { email } = req.body;

        const result = await this.forgotPasswordUseCase.handle(email);

        if (result.isErr()) {
            // Always respond with success to prevent email enumeration
            if (result.error instanceof ValidationError) {
                return next(result.error); // let validation errors propagate
            }

            // Log other errors for observability
            console.error('Forgot password error:', result.error);
        }

        return res.status(200).json({
            message:
                'If an account with that email exists, a password reset link has been sent.',
        });
    };
}
