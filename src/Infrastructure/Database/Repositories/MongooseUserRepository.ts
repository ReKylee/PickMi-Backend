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
import { UniqueEntityID } from '../../../Domain/ValueObjects/UniqueEntityID.js';
import {
    ConflictError,
    DomainError,
    ForbiddenError,
    NotFoundError,
    RepositoryError,
    ValidationError,
} from '../../../Shared/Errors.js';
import { UserDocument, UserModel } from '../Models/UserModel.js';

export class MongooseUserRepository implements IAdminUserRepository {
    /**
     * Generic helper to execute find queries and map results, reducing code duplication.
     */
    private _executeFindQuery(
        query: Query<UserDocument[], UserDocument>,
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

    /**
     * Handles Mongo's duplicate key error (11000) and wraps it in a ConflictError.
     */
    private _handleSaveError(err: unknown): RepositoryError | ConflictError {
        if (
            err instanceof mongoose.mongo.MongoServerError &&
            err.code === 11000
        ) {
            return new ConflictError('A user with that email already exists.');
        }

        return new RepositoryError('Failed to save user', err);
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
        ).andThen((doc) => {
            if (!doc) {
                return errAsync(new NotFoundError('User', id.toString()));
            }
            return UserMapper.toDomain(doc);
        });
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
        ).andThen((doc) => {
            if (!doc) {
                return errAsync(new NotFoundError('User', email.value));
            }
            return UserMapper.toDomain(doc);
        });
    }

    public findAll(): ResultAsync<User[], RepositoryError> {
        const query = UserModel.find({});
        return this._executeFindQuery(query, 'Failed to fetch all users');
    }

    public deleteByAdmin(
        userId: UniqueEntityID,
    ): ResultAsync<void, NotFoundError | RepositoryError | ForbiddenError> {
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
