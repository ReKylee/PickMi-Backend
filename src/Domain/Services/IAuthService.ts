import { ResultAsync } from 'neverthrow';
import { UnexpectedError } from '../../Shared/Errors.js';
import { User } from '../Users/User.js';

export interface IAuthService {
    signToken(user: User): string;
    comparePasswords(
        plain: string,
        hashed: string,
    ): ResultAsync<boolean, UnexpectedError>;
}
