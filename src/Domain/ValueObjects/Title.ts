import { Result } from 'neverthrow';
import { z } from 'zod';
import { ValidationError } from '../../Shared/Errors.js';

const titleSchema = z
    .string()
    .min(1, 'Title is required.')
    .max(100, 'Title cannot be longer than 100 characters.');

export class Title {
    private readonly _value: string;

    private constructor(value: string) {
        this._value = value;
    }

    public static create(title: string): Result<Title, ValidationError> {
        return titleSchema
            .neverthrowParse(title)
            .mapErr((e) => new ValidationError(e))
            .map((title) => new Title(title));
    }

    public get value(): string {
        return this._value;
    }
}
