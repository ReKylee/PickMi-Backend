import { ResultAsync } from 'neverthrow';
import { IAdminUserRepository } from '../../Domain/Users/IUserRepository.js';
import {
    ConflictError,
    UnexpectedError,
    ValidationError,
} from '../../Shared/Errors.js';
import { User } from '../../Domain/Users/User.js';
import { SignUpDTO } from '../Users/signUp.js';
import { JWTAuthService } from '../../Infrastructure/Services/JWTAuthService.js';

export class CreateAdmin {
    constructor(
        private readonly userRepository: IAdminUserRepository,
        private readonly authService: JWTAuthService,
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
            role: 'admin',
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
