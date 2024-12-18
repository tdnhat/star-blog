import mongoose, { Schema, Document } from "mongoose";

export interface INotification extends Document {
    type: "like" | "comment";
    recipient: mongoose.Types.ObjectId;
    sender: mongoose.Types.ObjectId;
    post?: mongoose.Types.ObjectId;
    comment?: mongoose.Types.ObjectId;
    message: string;
    isRead: boolean;
}

const NotificationSchema = new Schema(
    {
        type: {
            type: String,
            enum: ["like", "comment"],
            required: true,
        },
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
        },
        comment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment",
        },
        message: {
            type: String,
            required: true,
        },
        isRead: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<INotification>("Notification", NotificationSchema);
