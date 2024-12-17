import { Router } from "express";
import {
    createPost,
    deletePost,
    getAllPosts,
    getPostById,
    updatePost,
} from "../controllers/post.controller";
import { jwtMiddleware } from "../middlewares/jwtMiddleware";

const postRouter = Router();

postRouter.use(jwtMiddleware);

postRouter
    .get("/", getAllPosts)
    .get("/:postId", getPostById)
    .post("/", createPost)
    .put("/:postId", updatePost)
    .delete("/:postId", deletePost);

export default postRouter;
