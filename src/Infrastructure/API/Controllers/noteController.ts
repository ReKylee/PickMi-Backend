import { NextFunction, Request, Response } from 'express';
import { errAsync, okAsync } from 'neverthrow';
import { CreateNote } from '../../../Application/Notes/createNote.js';
import { DeleteNearbyById } from '../../../Application/Notes/deleteNearbyById.js';
import { GetNearbyNotes } from '../../../Application/Notes/getNearbyNotes.js';
import { ILocationService } from '../../../Domain/Services/ILocationService.js';
import { UniqueEntityID } from '../../../Domain/ValueObjects/UniqueEntityID.js';
import {
    AuthenticationError,
    NotFoundError,
    ValidationError,
} from '../../../Shared/Errors.js';
import { AuthenticatedRequest } from '../../../Shared/Middlewares/authMiddleware.js';

export class NoteController {
    constructor(
        private readonly createNoteUseCase: CreateNote,
        private readonly getNearbyNotesUseCase: GetNearbyNotes,
        private readonly deleteNoteUseCase: DeleteNearbyById,
        private readonly locationService: ILocationService,
    ) {}

    public createNote = async (
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction,
    ) => {
        const userId = req.user?.id;
        const { content, location, title } = req.body;

        if (!userId) {
            return next(new AuthenticationError('User not authenticated'));
        }

        const result = await this.createNoteUseCase
            .execute({
                title,
                content,
                location,
                userId,
            })
            .map((note) => ({
                id: note.id.toString(),
                message: 'Note thrown successfully!',
            }));

        result.match(
            (response) => res.status(201).json(response),
            (error) => next(error),
        );
    };

    public getNearbyNotes = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const { lat, lon, radius } = req.query;
            const result = await this.getNearbyNotesUseCase.execute({
                latitude: Number(lat),
                longitude: Number(lon),
                radius: Number(radius) || 5000,
            });

            if (result.isErr()) {
                return next(result.error);
            }

            const notes = result.value.map((note) => ({
                id: note.id.toString(),
                location: note.location,
            }));

            res.status(200).json(notes);
        } catch (error) {
            next(error);
        }
    };

    public getNearbyNoteById = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        const { id } = req.params;
        const lat = Number(req.query.lat);
        const lon = Number(req.query.lon);

        const result = await UniqueEntityID.from(id)
            .mapErr((e) => new ValidationError(e))
            .asyncAndThen((noteId) =>
                this.locationService.findNoteWithinRadius(
                    noteId,
                    lat,
                    lon,
                    1000,
                ),
            )
            .andThen((note) => {
                if (!note) {
                    return errAsync(new NotFoundError('Nearby Note', id));
                }
                return okAsync(note);
            })
            .map((note) => ({
                id: note.id.toString(),
                content: {
                    text: note.content.text,
                    drawingData: note.content.drawingData,
                },
            }));

        result.match(
            (noteDto) => res.status(200).json(noteDto),
            (error) => next(error),
        );
    };

    public deleteNote = async (
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const { id } = req.params;
            const { latitude, longitude } = req.body;

            const result = await this.deleteNoteUseCase.execute({
                id,
                location: { latitude, longitude },
            });

            result.match(
                () => {
                    res.status(200).json({
                        message: 'Note deleted successfully.',
                    });
                },
                (error) => next(error),
            );
        } catch (error) {
            next(error);
        }
    };
}
