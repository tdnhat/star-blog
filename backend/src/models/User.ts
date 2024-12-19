import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
    username: string;
    email: string;
    gender?: "male" | "female" | "other";
    phoneNumber?: string;
    address?: string;
    dateOfBirth?: Date;
    bio?: string;
    profilePicture?: string;
    coverPhoto?: string;
    password?: string;
    isVerified?: boolean;
    verificationToken?: string | null;
    oauthProvider?: string;
    oauthId?: string;
    savedPosts?: Schema.Types.ObjectId[];
}

const UserSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        gender: {
            type: String,
            enum: ["male", "female", "other"],
        },
        phoneNumber: {
            type: String,
        },
        address: {
            type: String,
        },
        dateOfBirth: {
            type: Date,
        },
        bio: {
            type: String,
        },
        profilePicture: {
            type: String,
        },
        coverPhoto: {
            type: String,
        },
        password: {
            type: String,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        verificationToken: {
            type: String,
        },
        oauthProvider: {
            type: String,
        },
        oauthId: {
            type: String,
        },
        savedPosts: [
            {
                type: Schema.Types.ObjectId,
                ref: "Post",
            },
        ],
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<IUser>("User", UserSchema);
