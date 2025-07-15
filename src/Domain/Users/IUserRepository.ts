import { ResultAsync } from 'neverthrow';
import { User } from './User.js';
import { UniqueEntityID } from '../ValueObjects/UniqueEntityID.js';
import {
    ConflictError,
    ForbiddenError,
    NotFoundError,
    RepositoryError,
    ValidationError,
} from '../../Shared/Errors.js';

export interface IUserRepository {
    save(user: User): ResultAsync<User, RepositoryError | ConflictError>;
    findById(
        id: UniqueEntityID,
    ): ResultAsync<User, NotFoundError | RepositoryError | ValidationError>;
    findByEmail(
        email: string,
    ): ResultAsync<User, NotFoundError | RepositoryError | ValidationError>;
}

export interface IAdminUserRepository extends IUserRepository {
    findAll(): ResultAsync<User[], RepositoryError>;
    deleteByAdmin(
        userId: UniqueEntityID,
    ): ResultAsync<void, NotFoundError | RepositoryError | ForbiddenError>;
}
