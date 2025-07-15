import { ResultAsync } from 'neverthrow';
import { IAdminNoteRepository } from '../../Domain/Notes/INoteRepository.js';
import {
    NotFoundError,
    RepositoryError,
    ForbiddenError,
} from '../../Shared/Errors.js';
import { UniqueEntityID } from '../../Domain/ValueObjects/UniqueEntityID.js';

export class DeleteNote {
    constructor(private readonly noteRepository: IAdminNoteRepository) {}

    public execute(
        noteIdRaw: string,
    ): ResultAsync<void, NotFoundError | RepositoryError | ForbiddenError> {
        return UniqueEntityID.from(noteIdRaw)
            .mapErr((e) => new RepositoryError('Invalid note ID', e))
            .asyncAndThen((noteId) =>
                this.noteRepository.deleteByAdmin(noteId),
            );
    }
}