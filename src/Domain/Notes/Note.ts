import { Result } from 'neverthrow';
import { ValidationError } from '../../Shared/Errors.js';
import { DomainEntity } from '../Shared/DomainEntity.js';
import { Content } from '../ValueObjects/Content.js';
import { Location } from '../ValueObjects/Location.js';
import { UniqueEntityID } from '../ValueObjects/UniqueEntityID.js';

export interface CreateNoteProps {
    content: { text: string; drawingData?: string };
    location: { latitude: number; longitude: number; placeId?: string };
    userId: string;
}

export interface NoteProps {
    content: Content;
    location: Location;
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
        // Validate Content VO
        const contentResult = Content.create(props.content);

        // Validate Location VO if present
        const locationResult = Location.create(props.location);

        // Validate userId VO
        const userIdResult = UniqueEntityID.from(props.userId);

        // Combine all validation results
        return Result.combineWithAllErrors([
            contentResult,
            locationResult,
            userIdResult,
        ])
            .mapErr((e) => new ValidationError(...e))
            .map(
                ([content, location, userId]) =>
                    new Note({ content, location, userId }, id),
            );
    }

    public static reconstitute(props: NoteProps, id: UniqueEntityID): Note {
        return new Note(props, id);
    }

    get content(): Content {
        return this.props.content;
    }

    get userId(): UniqueEntityID {
        return this.props.userId;
    }
    get location(): Location {
        return this.props.location;
    }
}
