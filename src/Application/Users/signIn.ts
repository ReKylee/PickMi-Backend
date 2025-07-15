import { ResultAsync, errAsync, ok } from 'neverthrow';
import { IAuthService } from '../../Domain/Services/IAuthService.js';
import { IUserRepository } from '../../Domain/Users/IUserRepository.js';
import { User } from '../../Domain/Users/User.js';
import {
    AuthenticationError,
    NotFoundError,
    UnexpectedError,
    ValidationError,
} from '../../Shared/Errors.js';
import { Email } from '../../Domain/ValueObjects/Email.js';

export interface SignInDTO {
    email: string;
    password: string;
}

export class SignIn {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly authService: IAuthService,
    ) {}

    public execute(
        dto: SignInDTO,
    ): ResultAsync<
        { user: User; token: string },
        ValidationError | AuthenticationError | UnexpectedError
    > {
        const emailResult = Email.create(dto.email);

        if (emailResult.isErr())
            return errAsync(new ValidationError(emailResult.error));

        return this.userRepository
            .findByEmail(emailResult.value)
            .mapErr((err) => {
                if (err instanceof NotFoundError) {
                    return new AuthenticationError('Invalid credentials');
                }
                return err;
            })
            .andThen((user) =>
                this.authService
                    .comparePasswords(dto.password, user.password.value)
                    .andThen((match) => {
                        if (!match) {
                            return errAsync(
                                new AuthenticationError('Invalid credentials'),
                            );
                        }

                        const token = this.authService.signToken(user);
                        return ok({ user, token });
                    }),
            );
    }
}
