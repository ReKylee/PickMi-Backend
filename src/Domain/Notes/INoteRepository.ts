import { ResultAsync } from 'neverthrow';
import { Note } from './Note.js';
import { UniqueEntityID } from '../ValueObjects/UniqueEntityID.js';
import {
    NotFoundError,
    RepositoryError,
    ForbiddenError,
} from '../../Shared/Errors.js';

export interface INoteRepository {
    /**
     * Saves a note (create or update)
     */
    save(note: Note): ResultAsync<Note, RepositoryError>;

    /**
     * Finds a note by its unique ID
     */
    findById(
        id: UniqueEntityID,
    ): ResultAsync<Note, NotFoundError | RepositoryError>;

    /**
     * Finds notes near a location (in meters)
     */
    findNearby(
        lat: number,
        lon: number,
        radius: number,
    ): ResultAsync<Note[], RepositoryError>;

    /**
     * Lists all notes by a specific user
     */
    findByUserId(userId: UniqueEntityID): ResultAsync<Note[], RepositoryError>;

    /**
     * Lists all notes in the system (admin only)
     */
    findAll(): ResultAsync<Note[], RepositoryError>;
}

export interface IAdminNoteRepository extends INoteRepository {
    deleteByAdmin(
        noteId: UniqueEntityID,
    ): ResultAsync<void, NotFoundError | RepositoryError | ForbiddenError>;
    deleteManyByUserId(
        userId: UniqueEntityID,
    ): ResultAsync<void, RepositoryError>;
}
