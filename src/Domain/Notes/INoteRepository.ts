import { Result } from 'neverthrow';
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
    save(note: Note): Result<void, RepositoryError>;

    /**
     * Finds a note by its unique ID
     */
    findById(id: UniqueEntityID): Result<Note, NotFoundError | RepositoryError>;

    /**
     * Finds notes near a location (in meters)
     */
    findNearby(
        lat: number,
        lon: number,
        radius: number,
    ): Result<Note[], RepositoryError>;

    /**
     * Lists all notes by a specific user
     */
    findByUserId(userId: UniqueEntityID): Result<Note[], RepositoryError>;

    /**
     * Lists all notes in the system (admin only)
     */
    findAll(): Result<Note[], RepositoryError>;
}

export interface IAdminNoteRepository extends INoteRepository {
    deleteByAdmin(
        noteId: UniqueEntityID,
    ): Result<void, NotFoundError | RepositoryError | ForbiddenError>;
}
