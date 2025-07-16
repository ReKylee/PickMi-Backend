import { ResultAsync } from 'neverthrow';
import { IAuthService } from '../../Domain/Services/IAuthService.js';
import { IUserRepository } from '../../Domain/Users/IUserRepository.js';
import { User } from '../../Domain/Users/User.js';
import {
    ConflictError,
    UnexpectedError,
    ValidationError,
} from '../../Shared/Errors.js';

export interface SignUpDTO {
    email: string;
    password: string;
}

export class SignUp {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly authService: IAuthService,
    ) {}

    public execute(
        dto: SignUpDTO,
    ): ResultAsync<
        { user: User; token: string },
        ValidationError | ConflictError | UnexpectedError
    > {
        return User.create({
            email: dto.email,
            password: dto.password,
            role: 'user',
        })
            .mapErr((e) => new ValidationError(e))
            .andThen((user) =>
                this.userRepository
                    .save(user)
                    .mapErr((repositoryError) => {
                        if (repositoryError instanceof ConflictError) {
                            return repositoryError;
                        }
                        return new UnexpectedError(repositoryError);
                    })
                    .map((savedUser) => {
                        const token = this.authService.signToken(savedUser);
                        return { user: savedUser, token };
                    }),
            );
    }
}
