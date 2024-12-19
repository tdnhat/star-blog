import { Router } from "express";
import {
    createPost,
    deletePost,
    getAllPosts,
    getPostById,
    getTagStats,
    getPostInteractions,
    updatePost,
    likePost,
    unlikePost,
    savePost,
    getSavedPosts,
} from "../controllers/post.controller";
import { jwtMiddleware } from "../middlewares/jwtMiddleware";
import { upload } from "../middlewares/upload.middleware";
import { uploadToCloudinary } from "../middlewares/cloudinary.middleware";
import { optionalAuth } from "../middlewares/optionalAuth";

const postRouter = Router();

postRouter
    .get("/", getAllPosts)
    .get("/tags/stats", getTagStats)
    .get("/:postId", optionalAuth, getPostById)
    .get("/:postId/saved-posts", jwtMiddleware, getSavedPosts)
    .get("/:postId/interactions", optionalAuth, getPostInteractions)
    .post("/:postId/save", jwtMiddleware, savePost)
    .post("/:postId/like", jwtMiddleware, likePost)
    .post("/:postId/unlike", jwtMiddleware, unlikePost)
    .post(
        "/",
        jwtMiddleware,
        upload.single("thumbnail"),
        uploadToCloudinary,
        createPost
    )
    .put("/:postId", jwtMiddleware, updatePost)
    .delete("/:postId", jwtMiddleware, deletePost);

export default postRouter;
