import { ResultAsync } from 'neverthrow';
import { IUserRepository } from '../../Domain/Users/IUserRepository.js';
import { Password } from '../../Domain/ValueObjects/Password.js';
import {
    BusinessRuleViolationError,
    RepositoryError,
    ValidationError,
} from '../../Shared/Errors.js';

export interface ResetPasswordDTO {
    token: string;
    newPassword: string;
}

export class ResetPassword {
    constructor(private readonly userRepository: IUserRepository) {}

    public execute(
        dto: ResetPasswordDTO,
    ): ResultAsync<void, BusinessRuleViolationError | RepositoryError> {
        return Password.create(dto.newPassword)
            .mapErr((e) => new ValidationError(e))
            .andThen((passwordVO) =>
                this.userRepository.updatePasswordByResetToken(
                    dto.token,
                    passwordVO,
                ),
            );
    }
}

