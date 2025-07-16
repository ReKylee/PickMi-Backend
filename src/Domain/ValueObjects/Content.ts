import { Result } from 'neverthrow';
import { z } from 'zod';
import { ValidationError } from '../../Shared/Errors.js';

const contentSchema = z.object({
    text: z.string().min(1, 'Content text is required.'),
    drawingData: z.string().optional(),
});

export interface ContentProps {
    text: string;
    drawingData?: string;
}

export class Content {
    readonly text: string;
    readonly drawingData?: string;

    private constructor(props: ContentProps) {
        this.text = props.text;
        this.drawingData = props.drawingData;
    }

    public static create(
        props: ContentProps,
    ): Result<Content, ValidationError> {
        return contentSchema
            .neverthrowParse(props)
            .mapErr((e) => new ValidationError(e))
            .map((content) => new Content(content));
    }
}
