import { Router } from "express";
import {
    getPostComments,
    addComment,
    addReply,
    deleteComment,
    toggleCommentLike,
} from "../controllers/comment.controller";
import { jwtMiddleware } from "../middlewares/jwtMiddleware";

const commentRouter = Router();

// commentRouter.use(jwtMiddleware);

commentRouter
    .get("/post/:postId", getPostComments)
    .post("/post/:postId", jwtMiddleware, addComment)
    .post("/reply/:commentId", jwtMiddleware, addReply)
    .post('/:commentId/toggle-like', jwtMiddleware, toggleCommentLike)
    .delete("/:commentId", jwtMiddleware, deleteComment);

export default commentRouter;
