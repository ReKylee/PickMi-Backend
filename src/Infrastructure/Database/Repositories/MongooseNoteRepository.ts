import {
    fromPromise,
    okAsync,
    errAsync,
    Result,
    ResultAsync,
} from 'neverthrow';
import { Note } from '../../../Domain/Notes/Note.js';
import { UniqueEntityID } from '../../../Domain/ValueObjects/UniqueEntityID.js';
import { NoteModel, NoteDocument } from '../Models/NoteModel.js';
import {
    NotFoundError,
    RepositoryError,
    ForbiddenError,
    ValidationError,
} from '../../../Shared/Errors.js';
import { IAdminNoteRepository } from '../../../Domain/Notes/INoteRepository.js';
import { NoteMapper } from '../../../Domain/Notes/NoteMapper.js';
import { Query } from 'mongoose';

export class MongooseNoteRepository implements IAdminNoteRepository {
    private _executeFindQuery(
        query: Query<NoteDocument[], NoteDocument>,
        errorMessage: string,
    ): ResultAsync<Note[], RepositoryError> {
        return fromPromise(
            query.exec(),
            (err) => new RepositoryError(errorMessage, err),
        )
            .andThen((docs) =>
                Result.combineWithAllErrors(docs.map(NoteMapper.toDomain)),
            )
            .mapErr(
                (errors) =>
                    new RepositoryError(
                        'Failed to map one or more notes to domain',
                        errors,
                    ),
            );
    }

    public save(note: Note): ResultAsync<Note, RepositoryError> {
        return fromPromise(
            NoteModel.findByIdAndUpdate(
                note.id.toString(),
                NoteMapper.toPersistence(note),
                { upsert: true, new: true },
            ).exec(),
            (err) => new RepositoryError('Failed to save note', err),
        ).andThen(NoteMapper.toDomain);
    }

    public findById(
        id: UniqueEntityID,
    ): ResultAsync<Note, NotFoundError | RepositoryError | ValidationError> {
        return fromPromise(
            NoteModel.findById(id.toString()).exec(),
            (err) =>
                new RepositoryError('Database query failed for findById', err),
        ).andThen((doc) => {
            if (!doc) {
                return errAsync(new NotFoundError('Note', id.toString()));
            }
            return NoteMapper.toDomain(doc);
        });
    }

    public findNearby(
        lat: number,
        lon: number,
        radius: number,
    ): ResultAsync<Note[], RepositoryError> {
        const query = NoteModel.find({
            location: {
                $near: {
                    $geometry: { type: 'Point', coordinates: [lon, lat] },
                    $maxDistance: radius,
                },
            },
        }).select('-content.drawingData');

        return this._executeFindQuery(query, 'Failed to find nearby notes');
    }

    public findByUserId(
        userId: UniqueEntityID,
    ): ResultAsync<Note[], RepositoryError> {
        const query = NoteModel.find({
            userId: userId.toString(),
        }).select('-content.drawingData');

        return this._executeFindQuery(query, 'Failed to find notes by user ID');
    }

    public findAll(): ResultAsync<Note[], RepositoryError> {
        const query = NoteModel.find({}).select('-content.drawingData');

        return this._executeFindQuery(query, 'Failed to fetch all notes');
    }

    public deleteByAdmin(
        noteId: UniqueEntityID,
    ): ResultAsync<void, NotFoundError | RepositoryError | ForbiddenError> {
        return fromPromise(
            NoteModel.findByIdAndDelete(noteId.toString()).exec(),
            (err) => new RepositoryError('Failed to delete note', err),
        ).andThen((doc) => {
            if (!doc) {
                return errAsync(new NotFoundError('Note', noteId.toString()));
            }
            return okAsync(undefined);
        });
    }
}
