import mongoose, { Query } from 'mongoose';
import {
    errAsync,
    fromPromise,
    okAsync,
    Result,
    ResultAsync,
} from 'neverthrow';
import { IAdminUserRepository } from '../../../Domain/Users/IUserRepository.js';
import { User } from '../../../Domain/Users/User.js';
import { UserMapper } from '../../../Domain/Users/UserMapper.js';
import { Email } from '../../../Domain/ValueObjects/Email.js';
import { Password } from '../../../Domain/ValueObjects/Password.js';
import { UniqueEntityID } from '../../../Domain/ValueObjects/UniqueEntityID.js';
import {
    BusinessRuleViolationError,
    ConflictError,
    DomainError,
    ForbiddenError,
    NotFoundError,
    RepositoryError,
    ValidationError,
} from '../../../Shared/Errors.js';
import { UserDocument, UserModel } from '../Models/UserModel.js';

type UserFindManyQuery = Query<UserDocument[], UserDocument>;

export class MongooseUserRepository implements IAdminUserRepository {
    public findByPasswordResetToken(
        token: string,
    ): ResultAsync<User | undefined, RepositoryError> {
        return fromPromise(
            UserModel.findOne({
                passwordResetToken: token,
                passwordResetExpires: { $gt: new Date() },
            }).exec(),
            (err) =>
                new RepositoryError(
                    'Database query failed for findByPasswordResetToken',
                    err,
                ),
        ).andThen((doc) => {
            if (!doc) {
                return okAsync(undefined);
            }
            return UserMapper.toDomain(doc).match(
                (user) => okAsync(user),
                (err) =>
                    errAsync(
                        new RepositoryError(
                            'Failed to map user from password reset token',
                            err,
                        ),
                    ),
            );
        });
    }

    public updatePasswordByResetToken(
        token: string,
        newPassword: Password,
    ): ResultAsync<void, RepositoryError | BusinessRuleViolationError> {
        return fromPromise(
            UserModel.findOneAndUpdate(
                {
                    passwordResetToken: token,
                    passwordResetExpires: { $gt: new Date() },
                },
                {
                    $set: {
                        password: newPassword.value,
                        passwordResetToken: undefined,
                        passwordResetExpires: undefined,
                    },
                },
                { new: true },
            ).exec(),
            (err) =>
                new RepositoryError(
                    'Failed to update password by reset token',
                    err,
                ),
        ).andThen((doc) => {
            if (!doc) {
                return errAsync(
                    new BusinessRuleViolationError(
                        'Password reset token is invalid or has expired',
                        { token: 'Token not found or expired' },
                    ),
                );
            }
            return okAsync(undefined);
        });
    }

    private _mapSingleUserResult(
        doc: UserDocument | null,
        notFoundId?: string,
    ): ResultAsync<User, NotFoundError | ValidationError> {
        if (!doc) {
            return errAsync(new NotFoundError('User', notFoundId));
        }
        // UserMapper.toDomain returns Result<User, ValidationError>
        return UserMapper.toDomain(doc).match(
            (user) => okAsync(user),
            (err) => errAsync(err),
        );
    }

    private _executeFindManyQuery(
        query: UserFindManyQuery,
        errorMessage: string,
    ): ResultAsync<User[], RepositoryError> {
        return fromPromise(
            query.exec(),
            (err) => new RepositoryError(errorMessage, err),
        )
            .andThen((docs) =>
                Result.combineWithAllErrors(docs.map(UserMapper.toDomain)),
            )
            .mapErr(
                (errors) =>
                    new RepositoryError(
                        'Failed to map one or more users to domain',
                        errors,
                    ),
            );
    }

    private _handleSaveError(err: unknown): RepositoryError | ConflictError {
        if (
            err instanceof mongoose.mongo.MongoServerError &&
            err.code === 11000
        ) {
            return new ConflictError('A user with that email already exists.');
        }
        return new RepositoryError('Failed to save user', err);
    }

    private _deleteUserById(
        userId: UniqueEntityID,
    ): ResultAsync<void, NotFoundError | RepositoryError> {
        return fromPromise(
            UserModel.findByIdAndDelete(userId.toString()).exec(),
            (err) => new RepositoryError('Failed to delete user', err),
        ).andThen((doc) => {
            if (!doc) {
                return errAsync(new NotFoundError('User', userId.toString()));
            }
            return okAsync(undefined);
        });
    }

    public save(
        user: User,
    ): ResultAsync<User, RepositoryError | ConflictError> {
        return fromPromise(
            UserModel.findByIdAndUpdate(
                user.id.toString(),
                UserMapper.toPersistence(user),
                { upsert: true, new: true },
            ).exec(),
            (err) => this._handleSaveError(err),
        ).andThen(UserMapper.toDomain);
    }

    public findById(
        id: UniqueEntityID,
    ): ResultAsync<User, NotFoundError | RepositoryError | ValidationError> {
        return fromPromise(
            UserModel.findById(id.toString()).exec(),
            (err) =>
                new RepositoryError('Database query failed for findById', err),
        ).andThen((doc) => this._mapSingleUserResult(doc, id.toString()));
    }

    public findByEmail(
        email: Email,
    ): ResultAsync<User, NotFoundError | RepositoryError | ValidationError> {
        return fromPromise(
            UserModel.findOne({ email: email.value }).exec(),
            (err) =>
                new RepositoryError(
                    'Database query failed for findByEmail',
                    err,
                ),
        ).andThen((doc) => this._mapSingleUserResult(doc, email.value));
    }

    public findAll(): ResultAsync<User[], RepositoryError> {
        return this._executeFindManyQuery(
            UserModel.find({}),
            'Failed to fetch all users',
        );
    }

    public deleteByAdmin(
        userId: UniqueEntityID,
    ): ResultAsync<void, NotFoundError | RepositoryError | ForbiddenError> {
        // In a real implementation you might check for admin permissions here.
        return this._deleteUserById(userId);
    }

    public deleteById(
        userId: UniqueEntityID,
    ): ResultAsync<void, NotFoundError | RepositoryError> {
        return this._deleteUserById(userId);
    }

    public setPasswordResetToken(
        userId: UniqueEntityID,
        token: string,
        expiresAt: Date,
    ): ResultAsync<void, DomainError> {
        return ResultAsync.fromPromise(
            UserModel.updateOne(
                { _id: userId },
                {
                    $set: {
                        passwordResetToken: token,
                        passwordResetExpires: expiresAt,
                    },
                },
            ).then(() => undefined),
            (e) => new RepositoryError('Failed to set password reset token', e),
        );
    }
}
