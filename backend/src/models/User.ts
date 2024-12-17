import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
    username: string;
    email: string;
    password?: string;
    isVerified?: boolean;
    verificationToken?: string | null;
    oauthProvider?: string;
    oauthId?: string;
}

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    verificationToken: {
        type: String
    },
    oauthProvider: {
        type: String,
    },
    oauthId: {
        type: String,
    },
}, {
    timestamps: true
})

export default mongoose.model<IUser>('User', UserSchema);