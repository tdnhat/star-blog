import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/User";
import { signToken } from "../utils/jwt";
import crypto from "crypto";
import sendMail from "../utils/email";
import cloudinary from "../config/cloudinary.config";

export const localSignup = async (
    req: Request,
    res: Response
): Promise<any> => {
    const { username, email, password } = req.body;

    try {
        // 1. Validate input
        if (!password) {
            return res.status(400).json({ error: "Password is required" });
        }
        if (!email) {
            return res.status(400).json({ error: "Email is required" });
        }
        if (!username) {
            return res.status(400).json({ error: "Username is required" });
        }

        // 2. Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Generate verification token
        const verificationToken = crypto.randomBytes(32).toString("hex");

        // 4. Create the user
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
            verificationToken,
        });

        // 5. Send verification email
        try {
            const verificationLink = `http://localhost:5000/api/v1/auth/verify-email?token=${verificationToken}`;
            await sendMail(
                email,
                "Email Verification",
                `Please verify your email by clicking on the following link: ${verificationLink}`
            );
        } catch (emailError) {
            console.error("Failed to send email:", emailError);
            await User.deleteOne({ _id: newUser._id }); // Roll back user creation
            return res.status(500).json({
                error: "Failed to send verification email. Please try again.",
            });
        }

        // 6. Generate and return JWT
        const token = signToken({ userId: newUser._id });
        res.status(201).json({
            message:
                "User created successfully. Please check your email for verification.",
            token,
        });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({
            error: "Failed to create user. Please try again.",
        });
    }
};

export const verifyEmail = async (
    req: Request,
    res: Response
): Promise<any> => {
    const { token } = req.query;
    try {
        const user = await User.findOne({ verificationToken: token });
        if (!user) {
            return res.status(404).json({ error: "Invalid or expired token" });
        }

        user.isVerified = true;
        user.verificationToken = null;
        await user.save();

        return res.redirect('http://localhost:3000/email-verified');
    } catch (error) {
        console.error("Error verifying email:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const localLogin = async (req: Request, res: Response): Promise<any> => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || !user.password) throw new Error("Invalid credentials");

        if (!user.isVerified) {
            return res.status(401).json({ error: "Please verify your email" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) throw new Error("Invalid credentials");

        const token = signToken({ userId: user._id });

        res.json({
            message: "Login successful",
            token,
        });
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const googleCallback = async (req: Request, res: Response) => {
    const user = req.user;
    const token = signToken({ userId: (user as any)._id });

    return res.redirect('http://localhost:3000/login?token=' + token);
};

// Get profile
export const getProfile = async (req: Request, res: Response): Promise<any> => {
    const userId = (req as any).user.userId;
    try {
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({ user });
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Update profile
export const updateProfile = async (
    req: Request,
    res: Response
): Promise<any> => {
    const userId = (req as any).user.userId;
    const { username, gender, phoneNumber, address, dateOfBirth, bio } =
        req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }

        // Update fields if provided
        if (username) user.username = username;
        if (gender) user.gender = gender;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (address) user.address = address;
        if (dateOfBirth) user.dateOfBirth = new Date(dateOfBirth);
        if (bio) user.bio = bio;

        await user.save();

        // Return updated user without password
        const updatedUser = user.toObject();
        delete updatedUser.password;

        res.status(200).json({
            message: "Profile updated successfully",
            user: updatedUser,
        });
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ error: "Failed to update profile" });
    }
};

// Update profile picture
export const updateProfilePicture = async (
    req: Request,
    res: Response
): Promise<any> => {
    try {
        const imageUrl = req.body.cloudinaryUrls[0];
        const userId = (req as any).user.userId;

        const user = await User.findById(userId);
        if (user?.profilePicture) {
            const publicId = user.profilePicture
                .split("/")
                .pop()
                ?.split(".")[0];
            if (publicId) {
                await cloudinary.uploader.destroy(publicId);
            }
        }

        await User.findByIdAndUpdate(userId, {
            profilePicture: imageUrl,
        });

        res.status(200).json({
            message: "Profile picture updated successfully",
            imageUrl,
        });
    } catch (error) {
        console.error("Error updating profile picture:", error);
        res.status(500).json({ error: "Failed to update profile picture" });
    }
};

// Update cover photo
export const updateCoverPhoto = async (
    req: Request,
    res: Response
): Promise<any> => {
    try {
        const imageUrl = req.body.cloudinaryUrls[0];
        const userId = (req as any).user.userId;

        const user = await User.findById(userId);
        if (user?.coverPhoto) {
            const publicId = user.coverPhoto
                .split("/")
                .pop()
                ?.split(".")[0];
            if (publicId) {
                await cloudinary.uploader.destroy(publicId);
            }
        }

        await User.findByIdAndUpdate(userId, {
            coverPhoto: imageUrl,
        });

        res.status(200).json({
            message: "Cover photo updated successfully",
            imageUrl,
        });
    } catch (error) {
        console.error("Error updating cover photo:", error);
        res.status(500).json({ error: "Failed to update cover photo" });
    }
};
// Delete profile picture
export const deleteProfilePicture = async (
    req: Request,
    res: Response
): Promise<any> => {
    const userId = (req as any).user.userId;
    try {
        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        if (user?.profilePicture) {
            const publicId = user.profilePicture
                .split("/")
                .pop()
                ?.split(".")[0];
            if (publicId) {
                await cloudinary.uploader.destroy(publicId);
            }
        }

        await user.updateOne({ profilePicture: null });

        res.status(200).json({
            message: "Profile picture deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting profile picture:", error);
        res.status(500).json({ error: "Failed to delete profile picture" });
    }
};

// Delete cover photo
export const deleteCoverPhoto = async (
    req: Request,
    res: Response
): Promise<any> => {
    const userId = (req as any).user.userId;
    try {
        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        if (user?.coverPhoto) {
            const publicId = user.coverPhoto
                .split("/")
                .pop()
                ?.split(".")[0];
            if (publicId) {
                await cloudinary.uploader.destroy(publicId);
            }
        }

        await user.updateOne({ coverPhoto: null });

        res.status(200).json({
            message: "Cover photo deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting cover photo:", error);
        res.status(500).json({ error: "Failed to delete cover photo" });
    }
};
