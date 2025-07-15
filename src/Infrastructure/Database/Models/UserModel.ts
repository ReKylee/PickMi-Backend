import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface UserDocument extends Document {
    _id: Types.ObjectId;
    email: string;
    password: string;
    role: 'user' | 'admin';
    passwordResetToken: String;
    passwordResetExpires: Date;
}

const UserSchema: Schema<UserDocument> = new Schema(
    {
        _id: { type: Schema.Types.ObjectId, required: true },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
            required: true,
        },
        passwordResetToken: { type: String },
        passwordResetExpires: { type: Date },
    },
    {
        timestamps: true,
    },
);

export const UserModel: Model<UserDocument> =
    mongoose.models.User || mongoose.model<UserDocument>('User', UserSchema);
