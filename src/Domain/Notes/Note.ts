import { Result } from 'neverthrow';
import { ValidationError } from '../../Shared/Errors.js';
import { DomainEntity } from '../Shared/DomainEntity.js';
import { Content } from '../ValueObjects/Content.js';
import { Title } from '../ValueObjects/Title.js';
import { UniqueEntityID } from '../ValueObjects/UniqueEntityID.js';

export interface CreateNoteProps {
    title: string;
    content: { text: string; drawingData?: string };
    userId: string;
}

export interface NoteProps {
    title: Title;
    content: Content;
    userId: UniqueEntityID;
}

export class Note extends DomainEntity<NoteProps> {
    private constructor(props: NoteProps, id?: UniqueEntityID) {
        super(props, id);
    }

    public static create(
        props: CreateNoteProps,
        id?: UniqueEntityID,
    ): Result<Note, ValidationError> {
        // Validate Title VO
        const titleResult = Title.create(props.title);

        // Validate Content VO
        const contentResult = Content.create(props.content);

        // Validate userId VO
        const userIdResult = UniqueEntityID.from(props.userId);

        // Combine all validation results
        return Result.combineWithAllErrors([
            titleResult,
            contentResult,
            userIdResult,
        ])
            .mapErr((e) => new ValidationError(...e))
            .map(
                ([title, content, userId]) =>
                    new Note({ title, content, userId }, id),
            );
    }

    get title(): Title {
        return this.props.title;
    }

    get content(): Content {
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
