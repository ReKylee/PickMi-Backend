import { ResultAsync } from 'neverthrow';
import { IAdminNoteRepository } from '../../Domain/Notes/INoteRepository.js';
import { UniqueEntityID } from '../../Domain/ValueObjects/UniqueEntityID.js';
import { Note } from '../../Domain/Notes/Note.js';
import {
    NotFoundError,
    RepositoryError,
    ValidationError,
} from '../../Shared/Errors.js';

export class GetUserNotes {
    constructor(private readonly noteRepository: IAdminNoteRepository) {}

    public execute(
        id: string,
    ): ResultAsync<Note[], ValidationError | NotFoundError | RepositoryError> {
        return UniqueEntityID.from(id)
            .mapErr((e) => new ValidationError(e))
            .asyncAndThen((userId) =>
                this.noteRepository.findByUserId(userId),
            );
    }
}