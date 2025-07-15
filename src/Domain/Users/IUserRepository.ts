import { Result } from 'neverthrow';
import { User } from './User.js';
import { UniqueEntityID } from '../ValueObjects/UniqueEntityID.js';
import { NotFoundError, RepositoryError } from '../../Shared/Errors.js';

export interface IUserRepository {
    /**
     * Persists a user to the data store.
     * @param user - The user entity to save.
     * @returns Result<void, RepositoryError>
     */
    save(user: User): Result<void, RepositoryError>;

    /**
     * Finds a user by their unique identifier.
     * @param id - The UniqueEntityID of the user.
     * @returns Result<User, NotFoundError | RepositoryError>
     */
    findById(id: UniqueEntityID): Result<User, NotFoundError | RepositoryError>;

    /**
     * Finds a user by their email address.
     * @param email - The normalized email string.
     * @returns Result<User, NotFoundError | RepositoryError>
     */
    findByEmail(email: string): Result<User, NotFoundError | RepositoryError>;

    /**
     * Deletes a user by their ID.
     * @param id - The UniqueEntityID of the user to delete.
     * @returns Result<void, NotFoundError | RepositoryError>
     */
    delete(id: UniqueEntityID): Result<void, NotFoundError | RepositoryError>;
}
