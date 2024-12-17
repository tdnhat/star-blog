import { Request, Response } from "express";
import Post from "../models/Post";
import Comment from "../models/Comment";

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
export const getAllPosts = async (
    req: Request,
    res: Response
): Promise<any> => {
    try {
        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .populate("author", "username");
        res.status(200).json({ posts });
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ error: "Failed to fetch posts" });
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

// Like/Unlike a post
export const togglePostLike = async (
    req: Request,
    res: Response
): Promise<any> => {
    const { postId } = req.params;
    const userId = (req as any).user.userId;
    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        const likeIndex = post.likes.indexOf(userId);

        if (likeIndex === -1) {
            post.likes.push(userId);
        } else {
            post.likes.splice(likeIndex, 1);
        }

        await post.save();

        res.status(200).json({
            liked: likeIndex === -1,
            likesCount: post.likes.length,
        });
    } catch (error) {
        console.error("Error toggling post like:", error);
        res.status(500).json({ error: "Failed to toggle post like" });
    }
};
