import { Router } from 'express';
import { authMiddleware } from '../../../Shared/Middlewares/authMiddleware.js';
import { requireAdmin } from '../../../Shared/Middlewares/requireAdmin.js';
import { AdminController } from '../Controllers/adminController.js';
import { DeleteNote } from '../../../Application/Admin/deleteNote.js';
import { DeleteUser } from '../../../Application/Admin/deleteUser.js';
import { GetAllNotes } from '../../../Application/Admin/getAllNotes.js';
import { GetAllUsers } from '../../../Application/Admin/getAllUsers.js';
import { GetUserById } from '../../../Application/Admin/getUserById.js';
import { GetUserNotes } from '../../../Application/Admin/getUserNotes.js';
import { GetNoteById } from '../../../Application/Admin/getNoteById.js';
import {
    userRepository,
    noteRepository,
    authService,
} from '../../../Shared/services.js';
import { CreateAdmin } from '../../../Application/Admin/createAdmin.js';

const adminRouter = Router();
const createAdminUseCase = new CreateAdmin(userRepository, authService);
const getAllUsersUseCase = new GetAllUsers(userRepository);
const getAllNotesUseCase = new GetAllNotes(noteRepository);
const getUserByIdUseCase = new GetUserById(userRepository);
const getUserNotesUseCase = new GetUserNotes(noteRepository);
const deleteUserUseCase = new DeleteUser(userRepository, noteRepository);
const deleteNoteUseCase = new DeleteNote(noteRepository);
const getNoteByidUseCase = new GetNoteById(noteRepository);
const adminController = new AdminController(
    createAdminUseCase,
    getAllUsersUseCase,
    getAllNotesUseCase,
    getUserByIdUseCase,
    getUserNotesUseCase,
    deleteUserUseCase,
    deleteNoteUseCase,
    getNoteByidUseCase,
);
// Does not require authentication or admin role but requires a secret header
adminRouter.post('/seed-admin', adminController.createAdmin);
adminRouter.use(authMiddleware, requireAdmin);

adminRouter.get('/users', adminController.getAllUsers);
adminRouter.get('/notes', adminController.getAllNotes);
adminRouter.get('/users/:id', adminController.getUserById);
adminRouter.get('/notes/:id', adminController.getNoteById);
adminRouter.get('/users/:id/notes', adminController.getUserNotes);
adminRouter.delete('/users/:id', adminController.deleteUser);
adminRouter.delete('/notes/:id', adminController.deleteNote);

export default adminRouter;
