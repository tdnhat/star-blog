import { Router } from "express";
import {
    createPost,
    deletePost,
    getAllPosts,
    getPostById,
    updatePost,
    likePost,
    unlikePost,
} from "../controllers/post.controller";
import { jwtMiddleware } from "../middlewares/jwtMiddleware";

const postRouter = Router();

// postRouter.use(jwtMiddleware);

postRouter
    .get("/", getAllPosts)
    .get("/:postId", getPostById)
    .post("/:postId/like", jwtMiddleware, likePost)
    .post("/:postId/unlike", jwtMiddleware, unlikePost)
    .post("/", jwtMiddleware, createPost)
    .put("/:postId", jwtMiddleware, updatePost)
    .delete("/:postId", jwtMiddleware, deletePost);

export default postRouter;
