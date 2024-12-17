import { Request, Response } from "express";
import Comment from "../models/Comment";

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
            res.status(403).json({ error: "Not authorized to delete this comment" });
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

// Like/Unlike a comment
// Like/Unlike a post
export const toggleCommentLike = async (
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

        if (likeIndex === -1) {
            comment.likes.push(userId);
        } else {
            comment.likes.splice(likeIndex, 1);
        }

        await comment.save();

        res.status(200).json({
            liked: likeIndex === -1,
            likesCount: comment.likes.length,
        });
    } catch (error) {
        console.error("Error toggling comment like:", error);
        res.status(500).json({ error: "Failed to toggle comment like" });
    }
};