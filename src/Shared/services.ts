import { MongooseNoteRepository } from '../Infrastructure/Database/Repositories/MongooseNoteRepository.js';
import { MongooseUserRepository } from '../Infrastructure/Database/Repositories/MongooseUserRepository.js';
import { EmailService } from '../Infrastructure/Services/EmailService.js';
import { JWTAuthService } from '../Infrastructure/Services/JWTAuthService.js';
import { LocationService } from '../Infrastructure/Services/LocationService.js';
// Shared instances
export const userRepository = new MongooseUserRepository();
export const noteRepository = new MongooseNoteRepository();

export const authService = new JWTAuthService(
    process.env.JWT_SECRET || 'your_default_secret',
    60 * 60 * 24 * 7, // 7 Days in seconds
);
export const locationService = new LocationService(noteRepository);

export const emailService = new EmailService(
    {
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER!,
            pass: process.env.SMTP_PASS!,
        },
    },
    process.env.EMAIL_FROM || 'PickMi <no-reply@pickmi.com>',
);

export const appBaseUrl = process.env.APP_BASE_URL || 'http://localhost:3000';
