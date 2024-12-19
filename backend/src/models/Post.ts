import mongoose, { Schema, Document } from "mongoose";

export interface IPost extends Document {
    title: string;
    thumbnail: string;
    content: string;
    author: mongoose.Types.ObjectId;
    tags: string[];
    status: "draft" | "published";
    likesCount: number;
    likes: mongoose.Types.ObjectId[];
    bookmarks: mongoose.Types.ObjectId[];
    commentsCount: number;
    comments: mongoose.Types.ObjectId[];
}

const PostSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        thumbnail: {
            type: String,
            default: null,
        },
        content: {
            type: String,
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
        likesCount: {
            type: Number,
            default: 0,
        },
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        bookmarks: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        commentsCount: {
            type: Number,
            default: 0,
        },
        comments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Comment",
            },
        ],
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<IPost>("Post", PostSchema);
