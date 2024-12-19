import { Router } from "express";
import {
    createPost,
    deletePost,
    getAllPosts,
    getPostById,
    getTagStats,
    updatePost,
    likePost,
    unlikePost,
} from "../controllers/post.controller";
import { jwtMiddleware } from "../middlewares/jwtMiddleware";
import { upload } from "../middlewares/upload.middleware";
import { uploadToCloudinary } from "../middlewares/cloudinary.middleware";

const postRouter = Router();

postRouter
    .get("/", getAllPosts)
    .get("/:postId", getPostById)
    .get("/tags/stats", getTagStats)
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
