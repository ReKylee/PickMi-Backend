import { ResultAsync } from 'neverthrow';
import { UniqueEntityID } from '../ValueObjects/UniqueEntityID.js';
import { RepositoryError } from '../../Shared/Errors.js';

export interface ILocationService {
    isNoteWithinRadius(
        noteId: UniqueEntityID,
        userLatitude: number,
        userLongitude: number,
        radiusMeters: number,
    ): ResultAsync<boolean, RepositoryError>;
}
