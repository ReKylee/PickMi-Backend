import { ResultAsync } from 'neverthrow';
import { IAdminNoteRepository } from '../../Domain/Notes/INoteRepository.js';
import { Note } from '../../Domain/Notes/Note.js';
import { RepositoryError } from '../../Shared/Errors.js';

export class GetAllNotes {
    constructor(private readonly noteRepository: IAdminNoteRepository) {}

    public execute(): ResultAsync<Note[], RepositoryError> {
        return this.noteRepository.findAll();
    }
}