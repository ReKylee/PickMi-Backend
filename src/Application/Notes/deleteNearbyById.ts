import { ResultAsync, errAsync } from 'neverthrow';
import { INoteRepository } from '../../Domain/Notes/INoteRepository.js';
import { ILocationService } from '../../Domain/Services/ILocationService.js';
import { UniqueEntityID } from '../../Domain/ValueObjects/UniqueEntityID.js';
import { Location } from '../../Domain/ValueObjects/Location.js';
import {
    NotFoundError,
    RepositoryError,
    ValidationError,
    ForbiddenError,
    BusinessRuleViolationError,
} from '../../Shared/Errors.js';

export interface DeleteNoteDTO {
    id: string;
    location: {
        latitude: number;
        longitude: number;
    };
}

export class DeleteNearbyById {
    constructor(
        private readonly noteRepository: INoteRepository,
        private readonly locationService: ILocationService,
        private readonly maxDistanceMeters: number = 100, // 100 meter tolerance
    ) {}

    public execute(
        dto: DeleteNoteDTO,
    ): ResultAsync<
        void,
        ValidationError | NotFoundError | RepositoryError | ForbiddenError
    > {
        const noteIdResult = UniqueEntityID.from(dto.id);
        const userLocationResult = Location.create({
            latitude: dto.location.latitude,
            longitude: dto.location.longitude,
        });

        if (noteIdResult.isErr()) {
            return errAsync(new ValidationError(noteIdResult.error));
        }
        if (userLocationResult.isErr()) {
            return errAsync(userLocationResult.error);
        }

        const noteId = noteIdResult.value;
        const userLocation = userLocationResult.value;

        return this.locationService
            .findNoteWithinRadius(
                noteId,
                userLocation.latitude,
                userLocation.longitude,
                this.maxDistanceMeters,
            )
            .andThen((nearbyNote) => {
                if (!nearbyNote) {
                    return errAsync(
                        new BusinessRuleViolationError(
                            'You must be at the note location to delete it.',
                        ),
                    );
                }

                return this.noteRepository.deleteById(noteId);
            });
    }
}
