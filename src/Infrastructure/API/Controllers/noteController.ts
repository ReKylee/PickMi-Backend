import { Request, Response, NextFunction } from 'express';
import { CreateNote } from '../../../Application/Notes/createNote.js';
import { GetNearbyNotes } from '../../../Application/Notes/getNearbyNotes.js';
import { AuthenticatedRequest } from '../../../Shared/Middlewares/authMiddleware.js';
import { GetNoteById } from '../../../Application/Notes/GetNoteById.js';

export class NoteController {
    constructor(
        private readonly createNoteUseCase: CreateNote,
        private readonly getNearbyNotesUseCase: GetNearbyNotes,
        private readonly getNoteByIdUseCase: GetNoteById,
    ) {}

    public createNote = async (
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                // This should be caught by auth middleware, but as a safeguard:
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
                radius: Number(radius) || 5000, // Default radius 5km
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

    public getNoteById = (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;

        this.getNoteByIdUseCase
            .execute(id)
            .map((note) => ({
                id: note.id.toString(),
                content: {
                    text: note.content.text,
                    drawingData: note.content.drawingData,
                },
            }))
            .match(
                (noteDto) => res.status(200).json(noteDto),
                (error) => next(error),
            );
    };
}
