import { Result } from 'neverthrow';
import { NoteDocument } from '../../Infrastructure/Database/Models/NoteModel.js';
import { ValidationError } from '../../Shared/Errors.js';
import { UniqueEntityID } from '../ValueObjects/UniqueEntityID.js';
import { Note } from './Note.js';
import { Types } from 'mongoose';
import { Content } from '../ValueObjects/Content.js';
import { Location } from '../ValueObjects/Location.js';

export class NoteMapper {
    static toDomain(doc: NoteDocument): Result<Note, ValidationError> {
        const idResult = UniqueEntityID.from(doc._id.toString());
        const userIdResult = UniqueEntityID.from(doc.userId.toString());
        const contentResult = Content.create(doc.content);
        const locationResult = Location.create({
            latitude: doc.location.coordinates[1],
            longitude: doc.location.coordinates[0],
            placeId: doc.location.placeId ?? undefined,
        });

        return Result.combineWithAllErrors([
            contentResult,
            idResult,
            locationResult,
            userIdResult,
        ])
            .mapErr((errs) => new ValidationError(...errs))
            .map(([content, id, location, userId]) =>
                Note.reconstitute(
                    {
                        content,
                        userId: userId,
                        location,
                    },
                    id,
                ),
            );
    }

    static toPersistence(note: Note) {
        return {
            _id: new Types.ObjectId(note.id.toString()),
            content: {
                text: note.content.text,
                drawingData: note.content.drawingData,
            },
            location: {
                type: 'Point',
                coordinates: [
                    note.location.longitude, // GeoJSON: [lon, lat]
                    note.location.latitude,
                ],
                placeId: note.location.placeId,
            },
            userId: note.userId.toString(),
        };
    }
}
