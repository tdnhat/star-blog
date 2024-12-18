import mongoose from "mongoose";
import Notification from "../models/Notification";

export const createPostNotification = async (
    type: "like",
    recipientId: mongoose.Types.ObjectId,
    senderId: mongoose.Types.ObjectId,
    message: string,
    postId: string
) => {
    await Notification.findOneAndDelete({
        type: "like",
        recipient: recipientId,
        sender: senderId,
        post: postId
    });

    const notification = new Notification({
        type,
        recipient: recipientId,
        sender: senderId,
        message,
        post: postId,
        isRead: false,
    });

    return await notification.save();
};

export const createCommentNotification = async (
    type: "comment",
    recipientId: mongoose.Types.ObjectId,
    senderId: mongoose.Types.ObjectId,
    message: string,
    commentId: string,
    postId: string
) => {
    await Notification.findOneAndDelete({
        type: "comment",
        recipient: recipientId,
        sender: senderId,
        comment: commentId,
        post: postId
    });

    const notification = new Notification({
        type,
        recipient: recipientId,
        sender: senderId,
        message,
        comment: commentId,
        post: postId,
        isRead: false,
    });

    return await notification.save();
};