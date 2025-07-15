import { z } from 'zod';
import { Result } from 'neverthrow';
import { ValidationError } from '../../Shared/Errors.js';

const locationSchema = z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    placeId: z.string().min(1).optional(),
});

export interface LocationProps {
    latitude: number;
    longitude: number;
    placeId?: string;
}

export class Location {
    private constructor(
        public readonly latitude: number,
        public readonly longitude: number,
        public readonly placeId?: string,
    ) {
        Object.freeze(this);
    }

    public static create(
        props: LocationProps,
    ): Result<Location, ValidationError> {
        return locationSchema
            .neverthrowParse(props)
            .mapErr((e) => new ValidationError(e))
            .map(
                ({ latitude, longitude, placeId }) =>
                    new Location(latitude, longitude, placeId),
            );
    }
}
