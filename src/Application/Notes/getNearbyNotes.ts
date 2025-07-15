import { ResultAsync, errAsync } from 'neverthrow';
import { INoteRepository } from '../../Domain/Notes/INoteRepository.js';
import { RepositoryError, ValidationError } from '../../Shared/Errors.js';
import { Location } from '../../Domain/ValueObjects/Location.js';
import { Note } from '../../Domain/Notes/Note.js';

export interface GetNearbyNotesDTO {
    latitude: number;
    longitude: number;
    radius: number;
}

export class GetNearbyNotes {
    constructor(private readonly noteRepository: INoteRepository) {}

    public execute(
        dto: GetNearbyNotesDTO,
    ): ResultAsync<Note[], ValidationError | RepositoryError> {
        const locationResult = Location.create({
            latitude: dto.latitude,
            longitude: dto.longitude,
            placeId: undefined,
        });

        if (locationResult.isErr()) {
            return errAsync(locationResult.error);
        }

        const { latitude, longitude } = locationResult.value;

        return this.noteRepository.findNearby(latitude, longitude, dto.radius);
    }
}
