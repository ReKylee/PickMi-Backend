import { ResultAsync } from 'neverthrow';
import { UniqueEntityID } from '../ValueObjects/UniqueEntityID.js';
import { RepositoryError } from '../../Shared/Errors.js';
import { Note } from '../Notes/Note.js';

export interface ILocationService {
    findNoteWithinRadius(
        noteId: UniqueEntityID,
        userLatitude: number,
        userLongitude: number,
        radiusMeters: number,
    ): ResultAsync<Note | null, RepositoryError>;
}
