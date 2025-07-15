import { errAsync, okAsync, ResultAsync } from 'neverthrow';
import { z } from 'zod';
import 'zod-neverthrow';
import { ValidationError } from '../../Shared/Errors.js';
import { DomainEntity } from '../Shared/DomainEntity.js';
import { Email } from '../ValueObjects/Email.js';
import { Password } from '../ValueObjects/Password.js';
import { UniqueEntityID } from '../ValueObjects/UniqueEntityID.js';

export const createUserSchema = z.object({
    email: z.string(),
    password: z.string(),
    role: z.enum(['user', 'admin']).default('user'),
});

export type CreateUserProps = z.input<typeof createUserSchema>;

export interface UserProps {
    email: Email;
    password: Password;
    role: 'user' | 'admin';
}

export class User extends DomainEntity<UserProps> {
    private constructor(props: UserProps, id?: UniqueEntityID) {
        super(props, id);
    }

    /**
     * Static factory method to create a new User instance.
     * It validates raw input and creates the necessary Value Objects.
     * @param {UserProps} props - The raw properties for creating the user.
     * @param {UniqueEntityID} [id] - Optional unique ID for the entity.
     * @returns {ResultAsync<User, ValidationError>}
     */
    public static create(
        props: CreateUserProps,
        id?: UniqueEntityID,
    ): ResultAsync<User, ValidationError> {
        return createUserSchema
            .neverthrowParse(props)
            .mapErr((e) => new ValidationError(e))
            .asyncAndThen(({ email, password, role }) => {
                const emailResult = Email.create(email);
                const passwordResult = Password.create(password);

                const emailAsync = emailResult.match(
                    (val) => okAsync(val),
                    (err) => errAsync(err),
                );

                return ResultAsync.combineWithAllErrors([
                    emailAsync,
                    passwordResult,
                ])
                    .map(([emailVO, passwordVO]) => {
                        return new User(
                            { email: emailVO, password: passwordVO, role },
                            id,
                        );
                    })
                    .mapErr((errors) => new ValidationError(...errors));
            });
    }
    public static reconstitute(props: UserProps, id: UniqueEntityID): User {
        return new User(props, id);
    }
    /**
     * Compares a plaintext password with the user's stored password.
     * @param {string} candidatePassword - The plaintext password to check.
     * @returns {Promise<boolean>}
     */
    public async comparePassword(candidatePassword: string): Promise<boolean> {
        return this.props.password.compare(candidatePassword);
    }

    // --- Getter methods to access entity properties ---

    get email(): Email {
        return this.props.email;
    }

    get password(): Password {
        return this.props.password;
    }

    get role(): 'user' | 'admin' {
        return this.props.role;
    }
}
