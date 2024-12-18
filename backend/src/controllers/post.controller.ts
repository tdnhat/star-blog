import { Request, Response } from "express";
import Post from "../models/Post";
import { createPostNotification } from "./notification.controller";
import { notifyUser } from "../services/websocket";
import { Document } from "mongoose";
import User from "../models/User";

interface PaginatedPosts {
    posts: Document[];
    total: number;
    limit: number;
    page: number;
    pages: number;
    totalPublished: number;
}

// Create a new post
export const createPost = async (req: Request, res: Response): Promise<any> => {
    const { title, content, tags, status } = req.body;
    const userId = (req as any).user.userId;

    try {
        if (!title || !content) {
            return res
                .status(400)
                .json({ error: "Title and content are required" });
        }

        const newPost = await Post.create({
            title,
            content,
            author: userId,
            tags: tags || [],
            status: status || "draft",
        });

        res.status(201).json({
            message: "Post created successfully",
            post: newPost,
        });
    } catch (error) {
        console.error("Error creating post:", error);
        res.status(500).json({ error: "Failed to create post" });
    }
};

// Get all posts
export const getAllPosts = async (req: Request, res: Response): Promise<any> => {
    try {
        const { 
            tags, 
            author, 
            status,
            sortBy = 'createdAt', 
            page = 1, 
            limit = 10 
        } = req.query;

        const query: Record<string, any> = {};

        if (tags) {
            query.tags = { $in: String(tags).split(',') };
        }
        if (author) {
            const authorUser = await User.findOne({ username: author });
            if (authorUser) {
                query.author = authorUser._id;
            }
        }
        if (status) {
            query.status = status;
        }

        const options = {
            skip: (Number(page) - 1) * Number(limit),
            limit: Number(limit),
            sort: { [String(sortBy)]: -1 },
            populate: { path: 'author', select: 'username profilePicture' }
        };

        const posts = await Post.find(query, null, options);
        const total = await Post.countDocuments(query);
        const totalPublished = await Post.countDocuments({ status: 'published', ...query });
        const totalPages = Math.ceil(total / Number(limit));

        const paginatedPosts : PaginatedPosts = {
            posts,
            total,
            limit: Number(limit),
            page: Number(page),
            pages: totalPages,
            totalPublished
        };

        res.status(200).json(paginatedPosts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
};
// Get a post by ID
export const getPostById = async (
    req: Request,
    res: Response
): Promise<any> => {
    const { postId } = req.params;
    try {
        const post = await Post.findById(postId).populate("author", "username");
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }
        res.status(200).json({ post });
    } catch (error) {
        console.error("Error fetching post:", error);
        res.status(500).json({ error: "Failed to fetch post" });
    }
};

// Update a post
export const updatePost = async (req: Request, res: Response): Promise<any> => {
    const { postId } = req.params;
    const { title, content, tags, status } = req.body;
    try {
        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            { title, content, tags, status },
            { new: true }
        ).populate("author", "username");
        if (!updatedPost) {
            return res.status(404).json({ error: "Post not found" });
        }
        res.status(200).json({
            message: "Post updated successfully",
            post: updatedPost,
        });
    } catch (error) {
        console.error("Error updating post:", error);
        res.status(500).json({ error: "Failed to update post" });
    }
};

// Delete a post
export const deletePost = async (req: Request, res: Response): Promise<any> => {
    const { postId } = req.params;
    try {
        const deletedPost = await Post.findByIdAndDelete(postId);
        if (!deletedPost) {
            return res.status(404).json({ error: "Post not found" });
        }
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        console.error("Error deleting post:", error);
        res.status(500).json({ error: "Failed to delete post" });
    }
};

// Like a post
export const likePost = async (
    req: Request,
    res: Response
): Promise<any> => {
    const { postId } = req.params;
    const senderId = (req as any).user.userId;
    try {
        const post = await Post.findById(postId);
        const recipientId = (post as any).author;
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        if (!post.likes.includes(senderId)) {
            post.likes.push(senderId);
            await post.save();

            await createPostNotification(
                "like",
                recipientId,
                senderId,
                "liked your post",
                postId
            );

            notifyUser(recipientId, {
                type: "like",
                message: "Someone liked your post",
            });

            res.status(200).json({
                liked: true,
                likesCount: post.likes.length,
            });
        } else {
            res.status(400).json({ error: "Post already liked" });
        }
    } catch (error) {
        console.error("Error liking post:", error);
        res.status(500).json({ error: "Failed to like post" });
    }
};

// Unlike a post
export const unlikePost = async (
    req: Request,
    res: Response
): Promise<any> => {
    const { postId } = req.params;
    const senderId = (req as any).user.userId;
    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        const likeIndex = post.likes.indexOf(senderId);
        if (likeIndex !== -1) {
            post.likes.splice(likeIndex, 1);
            await post.save();

            res.status(200).json({
                liked: false,
                likesCount: post.likes.length,
            });
        } else {
            res.status(400).json({ error: "Post not liked yet" });
        }
    } catch (error) {
        console.error("Error unliking post:", error);
        res.status(500).json({ error: "Failed to unlike post" });
    }
};