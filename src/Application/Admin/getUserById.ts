import { ResultAsync } from 'neverthrow';
import { IAdminUserRepository } from '../../Domain/Users/IUserRepository.js';
import { UniqueEntityID } from '../../Domain/ValueObjects/UniqueEntityID.js';
import {
    NotFoundError,
    RepositoryError,
    ValidationError,
} from '../../Shared/Errors.js';
import { User } from '../../Domain/Users/User.js';

export class GetUserById {
    constructor(private readonly userRepository: IAdminUserRepository) {}

    public execute(
        id: string,
    ): ResultAsync<User, ValidationError | NotFoundError | RepositoryError> {
        return UniqueEntityID.from(id)
            .mapErr((e) => new ValidationError(e))
            .asyncAndThen((userId) =>
                this.userRepository.findById(userId),
            );
    }
}