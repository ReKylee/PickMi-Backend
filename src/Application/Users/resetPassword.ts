import { ResultAsync } from 'neverthrow';
import { IUserRepository } from '../../Domain/Users/IUserRepository.js';
import { Password } from '../../Domain/ValueObjects/Password.js';
import {
    NotFoundError,
    ValidationError,
    DomainError,
    UnexpectedError,
} from '../../Shared/Errors.js';
import { User } from '../../Domain/Users/User.js';
import { UniqueEntityID } from '../../Domain/ValueObjects/UniqueEntityID.js';

export interface ResetPasswordDTO {
    token: string;
    newPassword: string;
}

export class ResetPasswordHandler {
    constructor(private readonly userRepository: IUserRepository) {}

    public handle(dto: ResetPasswordDTO): ResultAsync<void, DomainError> {
        // Find user by reset token and check expiration
        return ResultAsync.fromPromise(
            // The query must match token and expiration
            // We assume a method exists (if not will add to repo)
            this.userRepository['findByPasswordResetToken']?.(dto.token),
            () => new ValidationError('Invalid token or weak password.'),
        )
            .andThen((user: User | undefined) => {
                if (!user) {
                    return ResultAsync.err(
                        new ValidationError('Invalid token or weak password.'),
                    );
                }
                // @ts-ignore: Assume user has passwordResetExpires
                if (
                    !user['passwordResetExpires'] ||
                    user['passwordResetExpires'] < new Date()
                ) {
                    return ResultAsync.err(
                        new ValidationError('Invalid token or weak password.'),
                    );
                }
                return Password.create(dto.newPassword).andThen((passwordVO) =>
                    // set new password + clear reset token/expiration
                    this.userRepository
                        ['updatePasswordByResetToken']?.(
                            dto.token,
                            passwordVO,
                        )
                        .map(() => undefined),
                );
            });
    }
}