import { ResultAsync } from 'neverthrow';
import { User } from './User.js';
import { UniqueEntityID } from '../ValueObjects/UniqueEntityID.js';
import {
    BusinessRuleViolationError,
    ConflictError,
    DomainError,
    ForbiddenError,
    NotFoundError,
    RepositoryError,
    ValidationError,
} from '../../Shared/Errors.js';
import { Email } from '../ValueObjects/Email.js';
import { Password } from '../ValueObjects/Password.js';

export interface IUserRepository {
    save(user: User): ResultAsync<User, RepositoryError | ConflictError>;
    findById(
        id: UniqueEntityID,
    ): ResultAsync<User, NotFoundError | RepositoryError | ValidationError>;
    findByEmail(
        email: Email,
    ): ResultAsync<User, NotFoundError | RepositoryError | ValidationError>;
    deleteById(
        userId: UniqueEntityID,
    ): ResultAsync<void, NotFoundError | RepositoryError>;

    // Pass Reset
    findByPasswordResetToken(
        token: string,
    ): ResultAsync<User | undefined, RepositoryError>;
    setPasswordResetToken(
        userId: UniqueEntityID,
        token: string,
        expiresAt: Date,
    ): ResultAsync<void, DomainError>;
    updatePasswordByResetToken(
        token: string,
        newPassword: Password,
    ): ResultAsync<void, RepositoryError | BusinessRuleViolationError>;
}

export interface IAdminUserRepository extends IUserRepository {
    findAll(): ResultAsync<User[], RepositoryError>;
    deleteByAdmin(
        userId: UniqueEntityID,
    ): ResultAsync<void, NotFoundError | RepositoryError | ForbiddenError>;
}
