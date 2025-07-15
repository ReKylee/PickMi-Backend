import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import { ResultAsync } from 'neverthrow';
import { IAuthService } from '../../Domain/Services/IAuthService.js';
import { User } from '../../Domain/Users/User.js';
import { UnexpectedError } from '../../Shared/Errors.js';

export class JWTAuthService implements IAuthService {
    private readonly jwtSecret: string;
    private readonly expiresIn: number;

    constructor(
        jwtSecret: string,
        expiresInSeconds: number = 60 * 60 * 24 * 7,
    ) {
        // Default to 7 days in seconds
        this.jwtSecret = jwtSecret;
        this.expiresIn = expiresInSeconds;
    }

    public signToken(user: User): string {
        const payload = {
            sub: user.id.toString(),
            email: user.email,
            role: user.role,
        };

        const signOptions: SignOptions = {
            expiresIn: this.expiresIn,
        };

        return jwt.sign(payload, this.jwtSecret, signOptions);
    }

    comparePasswords(
        plain: string,
        hashed: string,
    ): ResultAsync<boolean, UnexpectedError> {
        return ResultAsync.fromPromise(
            bcrypt.compare(plain, hashed),
            (err) => new UnexpectedError(err),
        );
    }
}
