import { ResultAsync, errAsync, okAsync } from 'neverthrow';
import { IAdminNoteRepository } from '../../Domain/Notes/INoteRepository.js';
import { IUserRepository } from '../../Domain/Users/IUserRepository.js';
import { UniqueEntityID } from '../../Domain/ValueObjects/UniqueEntityID.js';
import {
    AuthenticationError,
    RepositoryError,
    UnexpectedError,
    ValidationError,
} from '../../Shared/Errors.js';

export interface DeleteAccountDTO {
    userId: string;
    password: string;
}

export class DeleteAccount {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly noteRepository: IAdminNoteRepository,
    ) {}

    public execute(
        dto: DeleteAccountDTO,
    ): ResultAsync<
        void,
        | ValidationError
        | AuthenticationError
        | RepositoryError
        | UnexpectedError
    > {
        return UniqueEntityID.from(dto.userId)
            .mapErr((e) => new ValidationError(e))
            .asyncAndThen((userId) =>
                this.userRepository
                    .findById(userId)
                    .andThen((user) =>
                        ResultAsync.fromPromise(
                            user.comparePassword(dto.password),
                            (e) =>
                                e instanceof ValidationError
                                    ? e
                                    : new UnexpectedError(e),
                        ).andThen((isValid) =>
                            isValid
                                ? okAsync(user)
                                : errAsync(
                                      new AuthenticationError(
                                          'Invalid password.',
                                      ),
                                  ),
                        ),
                    ),
            )
            .andThen((user) =>
                this.noteRepository
                    .deleteManyByUserId(user.id)
                    .map(() => user.id),
            )
            .andThen((userId) =>
                this.userRepository.deleteById(userId).map(() => undefined),
            );
    }
}
