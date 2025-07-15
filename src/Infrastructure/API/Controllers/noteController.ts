import { NextFunction, Request, Response } from 'express';
import { CreateNote } from '../../../Application/Notes/createNote.js';
import { GetNearbyNotes } from '../../../Application/Notes/getNearbyNotes.js';
import { DeleteNearbyById } from '../../../Application/Notes/deleteNearbyById.js';
import { NotFoundError } from '../../../Shared/Errors.js';
import { AuthenticatedRequest } from '../../../Shared/Middlewares/authMiddleware.js';

export class NoteController {
    constructor(
        private readonly createNoteUseCase: CreateNote,
        private readonly getNearbyNotesUseCase: GetNearbyNotes,
        private readonly deleteNoteUseCase: DeleteNearbyById,
    ) {}

    public createNote = async (
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                throw new Error('User not authenticated');
            }

            const { content, location, title } = req.body;

            const result = await this.createNoteUseCase.execute({
                title,
                content,
                location,
                userId,
            });

            if (result.isErr()) {
                return next(result.error);
            }

            res.status(201).json({
                id: result.value.id.toString(),
                message: 'Note thrown successfully!',
            });
        } catch (error) {
            next(error);
        }
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
                location: {
                    lat: note.location.latitude,
                    lon: note.location.longitude,
                },
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
        try {
            const { id } = req.params;
            const lat = Number(req.query.lat);
            const lon = Number(req.query.lon);

            const nearbyNotesResult = await this.getNearbyNotesUseCase.execute({
                latitude: lat,
                longitude: lon,
                radius: 1000,
            });

            if (nearbyNotesResult.isErr()) {
                return next(nearbyNotesResult.error);
            }

            const note = nearbyNotesResult.value.find(
                (n) => n.id.toString() === id,
            );

            if (!note) {
                return next(new NotFoundError('Nearby Note', id));
            }

            const noteDto = {
                id: note.id.toString(),
                content: {
                    text: note.content.text,
                    drawingData: note.content.drawingData,
                },
            };

            return res.status(200).json(noteDto);
        } catch (error) {
            next(error);
        }
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
