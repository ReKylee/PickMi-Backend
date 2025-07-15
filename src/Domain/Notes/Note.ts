import { z } from 'zod';
import { Result, ok, err } from 'neverthrow';
import { DomainEntity } from '../Shared/DomainEntity.js';
import { UniqueEntityID } from '../ValueObjects/UniqueEntityID.js';
import { ValidationError } from '../../Shared/Errors.js';

export const createNoteSchema = z.object({
    title: z
        .string()
        .min(1, 'Title is required.')
        .max(100, 'Title cannot be longer than 100 characters.'),
    content: z.string().min(1, 'Content is required.'),
    userId: z.string().uuid({ message: 'A valid user ID is required.' }),
});

export type CreateNoteProps = z.infer<typeof createNoteSchema>;

export interface NoteProps {
    title: string;
    content: string;
    userId: UniqueEntityID;
}

export class Note extends DomainEntity<NoteProps> {
    private constructor(props: NoteProps, id?: UniqueEntityID) {
        super(props, id);
    }

    /**
     * Static factory method to create a new Note instance.
     * It validates the raw input and creates the necessary value objects.
     * @param {CreateNoteProps} props - The raw properties for creating the note.
     * @param {UniqueEntityID} [id] - Optional unique ID for the entity.
     * @returns {Result<Note, ValidationError>} A Result containing either a new Note or a ValidationError.
     */
    public static create(
        props: CreateNoteProps,
        id?: UniqueEntityID,
    ): Result<Note, ValidationError> {
        const validationResult = createNoteSchema.safeParse(props);
        if (!validationResult.success) {
            return err(new ValidationError(validationResult.error));
        }

        const userIdResult = UniqueEntityID.from(validationResult.data.userId);

        // This only runs if userIdResult is successful.
        return userIdResult.andThen((userId) => {
            const note = new Note(
                {
                    title: validationResult.data.title,
                    content: validationResult.data.content,
                    userId: userId,
                },
                id,
            );
            return ok(note);
        });
    }

    // --- Getter methods to access entity properties ---

    get title(): string {
        return this.props.title;
    }

    get content(): string {
        return this.props.content;
    }

    get userId(): UniqueEntityID {
        return this.props.userId;
    }

    get createdAt(): Date {
        return (this.props as any).createdAt || new Date();
    }

    get updatedAt(): Date {
        return (this.props as any).updatedAt || new Date();
    }
}
