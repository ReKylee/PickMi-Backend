import { z } from 'zod';
import { ResultAsync } from 'neverthrow';
import bcrypt from 'bcrypt';
import { ValidationError } from '../../Shared/Errors.js';

const passwordSchema = z
    .string()
    .min(6, 'Password must be at least 6 characters long.');

export class Password {
    private readonly _value: string;

    // The constructor only accepts a pre-hashed value.
    private constructor(hashedValue: string) {
        this._value = hashedValue;
    }

    public static create(
        password: string,
    ): ResultAsync<Password, ValidationError> {
        return passwordSchema
            .neverthrowParse(password)
            .asyncMap(async (pass) => {
                const salt = await bcrypt.genSalt(10);
                return bcrypt.hash(pass, salt);
            })
            .map((hashedPassword) => new Password(hashedPassword))
            .mapErr((e) => new ValidationError(e));
    }

    /**
     * Creates a Password instance from an already hashed string.
     * This is useful for rehydrating the object from a database.
     * @param {string} hashedPassword - The stored password hash.
     * @returns {Password}
     */
    public static fromHash(hashedPassword: string): Password {
        return new Password(hashedPassword);
    }

    /**
     * Returns the hashed password value.
     * @returns {string}
     */
    public get value(): string {
        return this._value;
    }

    /**
     * Compares a plaintext password against the stored hash.
     * @param {string} candidate - The plaintext password to compare.
     * @returns {Promise<boolean>} True if the passwords match.
     */
    public async compare(candidate: string): Promise<boolean> {
        return bcrypt.compare(candidate, this._value);
    }
}
