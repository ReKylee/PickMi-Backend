import { ResultAsync } from 'neverthrow';
import { IAdminUserRepository } from '../../Domain/Users/IUserRepository.js';
import { User } from '../../Domain/Users/User.js';
import { RepositoryError } from '../../Shared/Errors.js';

export class GetAllUsers {
    constructor(private readonly userRepository: IAdminUserRepository) {}

    public execute(): ResultAsync<User[], RepositoryError> {
        return this.userRepository.findAll();
    }
}