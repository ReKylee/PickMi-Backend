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
    private readonly _text: string;
    private readonly _drawingData?: string;

    private constructor(props: ContentProps) {
        this._text = props.text;
        this._drawingData = props.drawingData;
    }

    public static create(
        props: ContentProps,
    ): Result<Content, ValidationError> {
        return contentSchema
            .neverthrowParse(props)
            .mapErr((e) => new ValidationError(e))
            .map((content) => new Content(content));
    }

    get text(): string {
        return this._text;
    }

    get drawingData(): string | undefined {
        return this._drawingData;
    }
}
