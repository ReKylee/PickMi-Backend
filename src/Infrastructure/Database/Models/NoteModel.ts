import mongoose, { Schema, Document, Model } from 'mongoose';

import { Types } from 'mongoose';
export interface NoteContent {
    text: string;
    drawingData?: string;
}

export interface GeoJSONPoint {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
    placeId?: string;
}

export interface NoteDocument extends Document {
    _id: Types.ObjectId;
    content: NoteContent;
    location: GeoJSONPoint;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}

// Sub-schema for content
const NoteContentSchema = new Schema<NoteContent>(
    {
        text: { type: String, required: true },
        drawingData: { type: String, required: false },
    },
    { _id: false },
);

// GeoJSON Point schema
const GeoJSONPointSchema = new Schema<GeoJSONPoint>(
    {
        type: {
            type: String,
            enum: ['Point'],
            required: true,
            default: 'Point',
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true,
            validate: {
                validator: function (val: number[]) {
                    return val.length === 2;
                },
                message:
                    'Coordinates must be an array of two numbers [longitude, latitude].',
            },
        },
        placeId: { type: String },
    },
    { _id: false },
);

// Main Note schema
const NoteSchema = new Schema<NoteDocument>(
    {
        _id: { type: Schema.Types.ObjectId, required: true },
        content: { type: NoteContentSchema, required: true },
        location: {
            type: GeoJSONPointSchema,
            required: false,
            index: '2dsphere',
        },
        userId: { type: String, required: true },
    },
    { timestamps: true },
);

export const NoteModel: Model<NoteDocument> =
    mongoose.models.Note || mongoose.model<NoteDocument>('Note', NoteSchema);
