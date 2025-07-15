import { Router } from 'express';
import { authMiddleware } from '../../../Shared/Middlewares/authMiddleware.js';
import { NoteController } from '../Controllers/noteController.js';

import { CreateNote } from '../../../Application/Notes/createNote.js';
import { GetNearbyNotes } from '../../../Application/Notes/getNearbyNotes.js';
import { DeleteNearbyById } from '../../../Application/Notes/deleteNearbyById.js';

import { noteRepository, locationService } from '../../../Shared/services.js';

const noteRouter = Router();

// Use Cases
const createNoteUseCase = new CreateNote(noteRepository);
const getNearbyNotesUseCase = new GetNearbyNotes(noteRepository);
const deleteNoteUseCase = new DeleteNearbyById(noteRepository, locationService);

const noteController = new NoteController(
    createNoteUseCase,
    getNearbyNotesUseCase,
    deleteNoteUseCase,
    locationService,
);

// Protected Routes
noteRouter.use(authMiddleware);

noteRouter.post('/', noteController.createNote);
noteRouter.get('/nearby', noteController.getNearbyNotes);
noteRouter.get('/:id', noteController.getNearbyNoteById);
noteRouter.delete('/:id', noteController.deleteNote);

export default noteRouter;
