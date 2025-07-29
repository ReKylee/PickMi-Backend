import { Request, Response, NextFunction } from 'express';
import { GetAllUsers } from '../../../Application/Admin/getAllUsers.js';
import { GetAllNotes } from '../../../Application/Admin/getAllNotes.js';
import { GetUserById } from '../../../Application/Admin/getUserById.js';
import { GetUserNotes } from '../../../Application/Admin/getUserNotes.js';
import { DeleteUser } from '../../../Application/Admin/deleteUser.js';
import { DeleteNote } from '../../../Application/Admin/deleteNote.js';
import { GetNoteById } from '../../../Application/Admin/getNoteById.js';
import { CreateAdmin } from '../../../Application/Admin/createAdmin.js';
import { AuthenticationError } from '../../../Shared/Errors.js';

export class AdminController {
    constructor(
        private readonly createAdminUseCase: CreateAdmin,
        private readonly getAllUsersUseCase: GetAllUsers,
        private readonly getAllNotesUseCase: GetAllNotes,
        private readonly getUserByIdUseCase: GetUserById,
        private readonly getUserNotesUseCase: GetUserNotes,
        private readonly deleteUserUseCase: DeleteUser,
        private readonly deleteNoteUseCase: DeleteNote,
        private readonly getNoteByIdUseCase: GetNoteById,
    ) {}
    public createAdmin = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        const secret = req.headers['x-seed-secret'];
        if (secret !== process.env.SEED_SECRET) {
            res.status(401).json(new AuthenticationError('Unauthorized'));
        }

        const { email, password } = req.body;
        const result = await this.createAdminUseCase
            .execute({ email, password })
            .map(() => ({
                message: 'Admin created successfully. Please sign in.',
            }));

        result.match(
            (response) => res.status(201).json(response),
            (error) => next(error),
        );
    };
    public getAllUsers = async (
        _: Request,
        res: Response,
        next: NextFunction,
    ) => {
        const result = await this.getAllUsersUseCase.execute();

        result.match(
            (users) => {
                const userDtos = users.map((user) => ({
                    id: user.id.toString(),
                    email: user.email.value,
                    role: user.role,
                }));
                res.status(200).json(userDtos);
            },
            (error) => next(error),
        );
    };

    public getAllNotes = async (
        _: Request,
        res: Response,
        next: NextFunction,
    ) => {
        const result = await this.getAllNotesUseCase.execute();

        result.match(
            (notes) => {
                const noteDtos = notes.map((note) => ({
                    id: note.id.toString(),
                    userId: note.userId.toString(),
                    content: {
                        text: note.content.text,
                        drawingData: note.content.drawingData,
                    },
                    location: {
                        latitude: note.location.latitude,
                        longitude: note.location.longitude,
                        placeId: note.location.placeId,
                    },
                }));
                res.status(200).json(noteDtos);
            },
            (error) => next(error),
        );
    };

    public getUserById = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        const { id } = req.params;

        const result = await this.getUserByIdUseCase.execute(id);

        result.match(
            (user) => {
                const userDto = {
                    id: user.id.toString(),
                    email: user.email.value,
                    role: user.role,
                };
                res.status(200).json(userDto);
            },
            (error) => next(error),
        );
    };
    public getNoteById = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        const { id } = req.params;

        const result = await this.getNoteByIdUseCase.execute(id);

        result.match(
            (note) => {
                const noteDto = {
                    id: note.id.toString(),
                    content: note.content,
                };
                res.status(200).json(noteDto);
            },
            (error) => next(error),
        );
    };

    public getUserNotes = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        const { id } = req.params;

        const result = await this.getUserNotesUseCase.execute(id);

        result.match(
            (notes) => {
                const noteDtos = notes.map((note) => ({
                    id: note.id.toString(),
                    content: note.content,
                    location: note.location,
                }));
                res.status(200).json(noteDtos);
            },
            (error) => next(error),
        );
    };

    public deleteUser = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        const { id } = req.params;

        const result = await this.deleteUserUseCase.execute(id);

        result.match(
            () => {
                res.status(200).json({
                    message:
                        'User and all associated data deleted successfully.',
                });
            },
            (error) => next(error),
        );
    };

    public deleteNote = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        const { id } = req.params;

        const result = await this.deleteNoteUseCase.execute(id);

        result.match(
            () => {
                res.status(200).json({
                    message: 'Note deleted successfully.',
                });
            },
            (error) => next(error),
        );
    };
}
