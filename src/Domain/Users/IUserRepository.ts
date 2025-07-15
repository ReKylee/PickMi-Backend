import { ResultAsync } from 'neverthrow';
import { User } from './User.js';
import { UniqueEntityID } from '../ValueObjects/UniqueEntityID.js';
import {
    ConflictError,
    DomainError,
    ForbiddenError,
    NotFoundError,
    RepositoryError,
    ValidationError,
} from '../../Shared/Errors.js';
import { Email } from '../ValueObjects/Email.js';

export interface IUserRepository {
    save(user: User): ResultAsync<User, RepositoryError | ConflictError>;
    findById(
        id: UniqueEntityID,
    ): ResultAsync<User, NotFoundError | RepositoryError | ValidationError>;
    findByEmail(
        email: Email,
    ): ResultAsync<User, NotFoundError | RepositoryError | ValidationError>;
    setPasswordResetToken(
        userId: UniqueEntityID,
        token: string,
        expiresAt: Date,
    ): ResultAsync<void, DomainError>;
}

export interface IAdminUserRepository extends IUserRepository {
    findAll(): ResultAsync<User[], RepositoryError>;
    deleteByAdmin(
        userId: UniqueEntityID,
    ): ResultAsync<void, NotFoundError | RepositoryError | ForbiddenError>;
}
