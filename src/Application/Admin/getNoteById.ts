import { ResultAsync } from 'neverthrow';
import { IAdminNoteRepository } from '../../Domain/Notes/INoteRepository.js';
import { Note } from '../../Domain/Notes/Note.js';
import { UniqueEntityID } from '../../Domain/ValueObjects/UniqueEntityID.js';
import {
    NotFoundError,
    RepositoryError,
    ValidationError,
} from '../../Shared/Errors.js';

export class GetNoteById {
    constructor(private readonly noteRepository: IAdminNoteRepository) {}

    public execute(
        rawId: string,
    ): ResultAsync<Note, ValidationError | NotFoundError | RepositoryError> {
        return UniqueEntityID.from(rawId)
            .mapErr((e) => new ValidationError(e))
            .asyncAndThen((noteId) =>
                this.noteRepository.findById(noteId).map((note) => note),
            );
    }
}
