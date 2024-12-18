import { Request, Response } from "express";
import Comment from "../models/Comment";
import { notifyUser } from "../services/websocket";
import { createCommentNotification, createPostNotification } from "./notification.controller";

// Get all comments for a post
export const getPostComments = async (
    req: Request,
    res: Response
): Promise<any> => {
    const { postId } = req.params;
    try {
        const mainComments = await Comment.find({
            post: postId,
            isReply: false,
        }).populate("author", "username");

        const commentsWithReplies = await Promise.all(
            mainComments.map(async (comment) => {
                const replies = await Comment.find({
                    parent: comment._id,
                    isReply: true,
                }).populate("author", "username");

                return {
                    ...comment.toObject(),
                    replies,
                };
            })
        );

        return res.status(200).json({ comments: commentsWithReplies });
    } catch (error) {}
};

// Add a comment to a post
export const addComment = async (req: Request, res: Response): Promise<any> => {
    const { postId } = req.params;
    const { content } = req.body;
    const userId = (req as any).user.userId;

    try {
        if (!content) {
            return res.status(400).json({ error: "Content is required" });
        }

        const newComment = await Comment.create({
            content,
            author: userId,
            post: postId,
            isReply: false,
        });

        const populatedComment = await newComment.populate(
            "author",
            "username"
        );

        await createCommentNotification(
            "comment",
            newComment.author,
            userId,
            "commented on your post",
            newComment._id as any,
            postId
        );

        setTimeout(() => {
            notifyUser(userId, {
                type: "comment",
                message: "Someone commented on your post",
            });
        }, 1000);

        res.status(201).json(populatedComment);
    } catch (error) {
        console.error("Error adding comment:", error);
        res.status(500).json({ error: "Failed to add comment" });
    }

};
// Add a reply to a comment
export const addReply = async (req: Request, res: Response): Promise<any> => {
    const { commentId } = req.params;
    const { content } = req.body;
    const userId = (req as any).user.userId;

    try {
        if (!content) {
            res.status(400).json({ error: "Content is required" });
            return;
        }

        const parentComment = await Comment.findById(commentId);
        if (!parentComment) {
            res.status(404).json({ error: "Parent comment not found" });
            return;
        }

        const reply = await Comment.create({
            content,
            author: userId,
            post: parentComment.post,
            parentComment: commentId,
            isReply: true,
        });

        const postId = parentComment.post;

        await createCommentNotification(
            "comment",
            reply.author,
            userId,
            "replied on your comment",
            reply._id as any,
            postId as any
        );

        setTimeout(() => {
            notifyUser(userId, {
                type: "comment",
                message: "Someone replied on your comment",
            });
        }, 1000);

        const populatedReply = await reply.populate("author", "username");

        res.status(201).json(populatedReply);
    } catch (error) {
        console.error("Error adding reply:", error);
        res.status(500).json({ error: "Failed to add reply" });
    }
};

// Delete a comment
export const deleteComment = async (
    req: Request,
    res: Response
): Promise<any> => {
    const { commentId } = req.params;
    const userId = (req as any).user.userId;

    try {
        const comment = await Comment.findById(commentId);

        if (!comment) {
            res.status(404).json({ error: "Comment not found" });
            return;
        }

        if (comment.author.toString() !== userId) {
            res.status(403).json({
                error: "Not authorized to delete this comment",
            });
            return;
        }

        if (!comment.isReply) {
            // Delete all replies if it's a main comment
            await Comment.deleteMany({ parentComment: commentId });
        }

        await comment.deleteOne();

        res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
        console.error("Error deleting comment:", error);
        res.status(500).json({ error: "Failed to delete comment" });
    }
};

// Like a comment
export const likeComment = async (
    req: Request,
    res: Response
): Promise<any> => {
    const { commentId } = req.params;
    const senderId = (req as any).user.userId;
    try {
        const comment = await Comment.findById(commentId);
        const recipientId = (comment as any).author;

        if (!comment) {
            return res.status(404).json({ error: "Comment not found" });
        }

        if (!comment.likes.includes(senderId)) {
            comment.likes.push(senderId);
            await comment.save();

            // Notify the comment author about the like
            await createCommentNotification(
                "comment",
                recipientId,
                senderId,
                "liked your comment",
                commentId,
                comment.post.toString()
            );

            notifyUser(recipientId, {
                type: "like",
                message: "Someone liked your comment",
            });

            res.status(200).json({
                liked: true,
                likesCount: comment.likes.length,
            });
        } else {
            res.status(400).json({ error: "Comment already liked" });
        }
    } catch (error) {
        console.error("Error liking comment:", error);
        res.status(500).json({ error: "Failed to like comment" });
    }
};

// Unlike a comment
export const unlikeComment = async (
    req: Request,
    res: Response
): Promise<any> => {
    const { commentId } = req.params;
    const userId = (req as any).user.userId;
    try {
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ error: "Comment not found" });
        }

        const likeIndex = comment.likes.indexOf(userId);
        if (likeIndex !== -1) {
            comment.likes.splice(likeIndex, 1);
            await comment.save();
        }

        res.status(200).json({
            liked: false,
            likesCount: comment.likes.length,
        });
    } catch (error) {
        console.error("Error unliking comment:", error);
        res.status(500).json({ error: "Failed to unlike comment" });
    }
};
