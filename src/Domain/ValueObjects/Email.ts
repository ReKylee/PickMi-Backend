import { z } from 'zod';
import { Result } from 'neverthrow';
import { ValidationError } from '../../Shared/Errors.js';

const emailSchema = z.string().email('Invalid email format.');

export class Email {
    private readonly _value: string;

    private constructor(email: string) {
        this._value = email.toLowerCase();
    }

    /**
     * Creates an Email Value Object from a string.
     * @param {string} email - The email address string.
     * @returns {Result<Email, ValidationError>}
     */
    public static create(email: string): Result<Email, ValidationError> {
        return emailSchema
            .neverthrowParse(email)
            .mapErr((e) => new ValidationError(e))
            .map((email) => new Email(email));
    }

    /**
     * Returns the string representation of the email.
     * @returns {string}
     */
    public get value(): string {
        return this._value;
    }
}
