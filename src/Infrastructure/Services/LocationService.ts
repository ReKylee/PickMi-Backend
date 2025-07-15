import { ResultAsync } from 'neverthrow';
import { INoteRepository } from '../../Domain/Notes/INoteRepository.js';
import { ILocationService } from '../../Domain/Services/ILocationService.js';
import { Note } from '../../Domain/Notes/Note.js';
import { UniqueEntityID } from '../../Domain/ValueObjects/UniqueEntityID.js';
import { RepositoryError } from '../../Shared/Errors.js';

export class LocationService implements ILocationService {
    constructor(private readonly noteRepository: INoteRepository) {}

    public findNoteWithinRadius(
        noteId: UniqueEntityID,
        userLatitude: number,
        userLongitude: number,
        radiusMeters: number,
    ): ResultAsync<Note | null, RepositoryError> {
        return this.noteRepository
            .findNearby(userLatitude, userLongitude, radiusMeters)
            .map((nearbyNotes) => {
                const foundNote = nearbyNotes.find((note) =>
                    note.id.equals(noteId),
                );
                return foundNote || null;
            });
    }
}
