import { randomUUID } from 'crypto';
import { z } from 'zod';
import { err, ok, Result } from 'neverthrow';
import { ValidationError } from '../../Shared/Errors.js';

const uuidSchema = z.object({
    id: z
        .string({
            required_error: 'UUID is required',
            invalid_type_error: 'UUID must be a string',
        })
        .uuid({ message: 'Invalid UUID format' }),
});

export type UniqueEntityIDProps = { id: string };

export class UniqueEntityID {
    private readonly value: string;

    private constructor(id: string) {
        this.value = id;
    }
    public static create(): UniqueEntityID {
        return new UniqueEntityID(randomUUID());
    }

    public static from(id: string): Result<UniqueEntityID, ValidationError> {
        return uuidSchema
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
