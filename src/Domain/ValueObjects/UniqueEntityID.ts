import { z } from 'zod';
import { Result } from 'neverthrow';
import { ValidationError } from '../../Shared/Errors.js';
import { Types } from 'mongoose';

const objectIdSchema = z.object({
    id: z
        .string({
            required_error: 'ObjectId is required',
            invalid_type_error: 'ObjectId must be a string',
        })
        .regex(/^[0-9a-fA-F]{24}$/, {
            message:
                'Invalid ObjectId format (must be 24 character hex string)',
        }),
});

export type UniqueEntityIDProps = { id: string };

export class UniqueEntityID {
    private readonly value: string;

    private constructor(id: string) {
        this.value = id;
    }

    public static create(): UniqueEntityID {
        return new UniqueEntityID(new Types.ObjectId().toString());
    }

    public static from(id: string): Result<UniqueEntityID, ValidationError> {
        return objectIdSchema
            .neverthrowParse({ id })
            .mapErr((e) => new ValidationError(e))
            .map(({ id }) => new UniqueEntityID(id));
    }

    public toString(): string {
        return this.value;
    }

    public equals(other?: UniqueEntityID): boolean {
        if (!other) {
            return false;
        }
        return this.value === other.value;
    }
}
