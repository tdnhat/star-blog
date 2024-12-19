import mongoose, { Document, Schema } from "mongoose";

export interface IComment extends Document {
    content: string;
    author: mongoose.Types.ObjectId;
    post: mongoose.Types.ObjectId;
    parentComment?: mongoose.Types.ObjectId;
    likes: mongoose.Types.ObjectId[];
    isReply: boolean;
}

const CommentSchema = new Schema({
    content: {
        type: String,
        required: true,
        trim: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    parentComment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        default: null
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    isReply: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

CommentSchema.index({ post: 1, parentComment: 1 });

export default mongoose.model<IComment>('Comment', CommentSchema);