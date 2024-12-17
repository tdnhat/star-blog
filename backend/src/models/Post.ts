import mongoose, { Schema, Document } from "mongoose";

export interface IPost extends Document {
    title: string;
    content: object; // Delta format for Quill.js
    author: mongoose.Types.ObjectId;
    tags: string[];
    status: "draft" | "published";
    likes: mongoose.Types.ObjectId[];
    comments: mongoose.Types.ObjectId[];
}

const PostSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        content: {
            type: Object, // Stores Quill's Delta format
            required: true,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        tags: [
            {
                type: String,
                trim: true,
            },
        ],
        status: {
            type: String,
            enum: ["draft", "published"],
            default: "draft",
        },
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        comments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Comment",
            },
        ]
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<IPost>("Post", PostSchema);
