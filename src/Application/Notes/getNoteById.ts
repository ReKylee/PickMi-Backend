import { ResultAsync } from 'neverthrow';
import { INoteRepository } from '../../Domain/Notes/INoteRepository.js';
import { UniqueEntityID } from '../../Domain/ValueObjects/UniqueEntityID.js';
import {
    NotFoundError,
    RepositoryError,
    ValidationError,
} from '../../Shared/Errors.js';
import { Note } from '../../Domain/Notes/Note.js';

export class GetNoteById {
    constructor(private readonly noteRepository: INoteRepository) {}

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
