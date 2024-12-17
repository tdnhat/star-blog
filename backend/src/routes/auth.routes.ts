import { Router } from "express";
import {
    getProfile,
    updateProfile,
    localSignup,
    localLogin,
    verifyEmail,
    googleCallback,
    updateProfilePicture,
    updateCoverPhoto,
    deleteProfilePicture,
    deleteCoverPhoto,
} from "../controllers/auth.controller";
import passport from "../utils/passportSetup";
import { jwtMiddleware } from "../middlewares/jwtMiddleware";
import { upload } from "../middlewares/upload.middleware";
import { uploadToCloudinary } from "../middlewares/cloudinary.middleware";

const authRouter = Router();

// Profile routes
authRouter
    .get("/profile", jwtMiddleware, getProfile)
    .post(
        "/profile/avatar",
        jwtMiddleware,
        upload.single("image"),
        uploadToCloudinary,
        updateProfilePicture
    )
    .post(
        "/profile/cover",
        jwtMiddleware,
        upload.single("image"),
        uploadToCloudinary,
        updateCoverPhoto
    )
    .post("/profile", jwtMiddleware, updateProfile)
    .delete("/profile/avatar", jwtMiddleware, deleteProfilePicture)
    .delete("/profile/cover", jwtMiddleware, deleteCoverPhoto);

// Local Auth
authRouter
    .post("/signup", localSignup)
    .post("/login", localLogin)
    .get("/verify-email", verifyEmail);

// Google Auth
authRouter
    .get(
        "/google",
        passport.authenticate("google", { scope: ["profile", "email"] })
    )
    .get(
        "/google/callback",
        passport.authenticate("google", { failureRedirect: "/login" }),
        googleCallback
    );

export default authRouter;
