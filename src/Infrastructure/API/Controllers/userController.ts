import { Request, Response, NextFunction } from "express";

import { SignUpUseCase } from "../../../Application/Users/signUp.js";
import { SignInUseCase } from "../../../Application/Users/signIn.js";

export class UserController {
    constructor(
        private readonly signUpUseCase: SignUpUseCase,
        private readonly signInUseCase: SignInUseCase,
        // private readonly forgotPasswordUseCase: ForgotPasswordUseCase,
    ) {}

    /**
     * Handles the HTTP request for the POST /api/auth/signup endpoint.
     */
    public signUp = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, password } = req.body;

            // Delegate the actual work to the sign-up use case
            await this.signUpUseCase.execute({ email, password });

            // According to your README, send a success message
            return res
                .status(201)
                .json({ message: "User created successfully." });
        } catch (error) {
            // If any error occurs (e.g., ValidationError, BusinessRuleError),
            // pass it to the global error handler middleware.
            next(error);
        }
    };

    /**
     * Handles the HTTP request for the POST /api/auth/signin endpoint.
     */
    public signIn = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, password } = req.body;

            // Delegate the work to the sign-in use case
            const result = await this.signInUseCase.execute({
                email,
                password,
            });

            // Send the token back on success, as defined in the README
            return res.status(200).json(result);
        } catch (error) {
            // Pass any AuthenticationError to the global error handler
            next(error);
        }
    };

    // public forgotPassword = async (req: Request, res: Response, next: NextFunction) => { ... }
}
