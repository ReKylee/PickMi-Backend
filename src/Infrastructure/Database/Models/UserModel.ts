import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * Interface representing the User document in MongoDB.
 * This is the data structure that will be stored in the database.
 */
export interface IUserDocument extends Document {
    email: string;
    password: string;
    role: 'user' | 'admin';
}

const UserSchema: Schema<IUserDocument> = new Schema(
    {
        _id: { type: String, required: true },
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
    },
    {
        timestamps: true,
    },
);

const UserModel: Model<IUserDocument> =
    mongoose.models.User || mongoose.model<IUserDocument>('User', UserSchema);

export default UserModel;
