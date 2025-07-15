import { ResultAsync } from 'neverthrow';
import { IAdminUserRepository } from '../../Domain/Users/IUserRepository.js';
import { IAdminNoteRepository } from '../../Domain/Notes/INoteRepository.js';
import { UniqueEntityID } from '../../Domain/ValueObjects/UniqueEntityID.js';
import {
    NotFoundError,
    RepositoryError,
    ForbiddenError,
} from '../../Shared/Errors.js';

export class DeleteUser {
    constructor(
        private readonly userRepository: IAdminUserRepository,
        private readonly noteRepository: IAdminNoteRepository,
    ) {}

    public execute(
        userIdRaw: string,
    ): ResultAsync<void, NotFoundError | RepositoryError | ForbiddenError> {
        return UniqueEntityID.from(userIdRaw)
            .mapErr((e) => new RepositoryError('Invalid user ID', e))
            .asyncAndThen((userId) =>
                this.noteRepository
                    .deleteManyByUserId(userId)
                    .andThen(() => this.userRepository.deleteByAdmin(userId)),
            );
    }
}

