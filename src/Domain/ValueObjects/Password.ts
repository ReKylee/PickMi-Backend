import bcrypt from 'bcrypt';
import { ResultAsync } from 'neverthrow';
import { z } from 'zod';
import { UnexpectedError, ValidationError } from '../../Shared/Errors.js';

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

    public static fromHash(hashedPassword: string): Password {
        return new Password(hashedPassword);
    }

    public get value(): string {
        return this._value;
    }

    public compare(candidate: string): ResultAsync<boolean, UnexpectedError> {
        return ResultAsync.fromPromise(
            bcrypt.compare(candidate, this._value),
            (err) => new UnexpectedError(err),
        );
    }
}
