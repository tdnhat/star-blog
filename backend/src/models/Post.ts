import mongoose, { Schema, Document } from "mongoose";

export interface IPost extends Document {
    title: string;
    content: object; // Delta format for Quill.js
    author: mongoose.Types.ObjectId;
    tags: string[];
    status: "draft" | "published";
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
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<IPost>("Post", PostSchema);
