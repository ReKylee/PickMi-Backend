import { ResultAsync } from 'neverthrow';
import { INoteRepository } from '../../Domain/Notes/INoteRepository.js';
import { ILocationService } from '../../Domain/Services/ILocationService.js';
import { UniqueEntityID } from '../../Domain/ValueObjects/UniqueEntityID.js';
import { RepositoryError } from '../../Shared/Errors.js';

export class LocationService implements ILocationService {
    constructor(private readonly noteRepository: INoteRepository) {}

    public isNoteWithinRadius(
        noteId: UniqueEntityID,
        userLatitude: number,
        userLongitude: number,
        radiusMeters: number,
    ): ResultAsync<boolean, RepositoryError> {
        return this.noteRepository
            .findNearby(userLatitude, userLongitude, radiusMeters)
            .map((nearbyNotes) =>
                nearbyNotes.some((note) => note.id.equals(noteId)),
            );
    }
}
