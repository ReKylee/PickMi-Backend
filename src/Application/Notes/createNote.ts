import { ResultAsync, errAsync } from 'neverthrow';
import { INoteRepository } from '../../Domain/Notes/INoteRepository.js';
import { ValidationError, RepositoryError } from '../../Shared/Errors.js';
import { Note } from '../../Domain/Notes/Note.js';
import { CreateNoteProps } from '../../Domain/Notes/Note.js';

export class CreateNote {
    constructor(private readonly noteRepository: INoteRepository) {}

    public execute(
        dto: CreateNoteProps,
    ): ResultAsync<Note, ValidationError | RepositoryError> {
        const noteResult = Note.create(dto);

        if (noteResult.isErr()) {
            return errAsync(noteResult.error);
        }

        return this.noteRepository.save(noteResult.value);
    }
}
