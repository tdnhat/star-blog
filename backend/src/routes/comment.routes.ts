import { Router } from "express";
import {
    getPostComments,
    addComment,
    addReply,
    deleteComment,
    likeComment,
    unlikeComment,
} from "../controllers/comment.controller";
import { jwtMiddleware } from "../middlewares/jwtMiddleware";

const commentRouter = Router();

// commentRouter.use(jwtMiddleware);

commentRouter
    .get("/post/:postId", getPostComments)
    .post("/post/:postId", jwtMiddleware, addComment)
    .post("/reply/:commentId", jwtMiddleware, addReply)
    .post('/:commentId/like', jwtMiddleware, likeComment)
    .post('/:commentId/unlike', jwtMiddleware, unlikeComment)
    .delete("/:commentId", jwtMiddleware, deleteComment);

export default commentRouter;
