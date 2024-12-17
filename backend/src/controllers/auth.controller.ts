import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/User";
import { signToken } from "../utils/jwt";
import crypto from "crypto";
import sendMail from "../utils/email";

export const localSignup = async (req: Request, res: Response): Promise<any> => {
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
            const verificationLink = `http://localhost:3000/verify-email?token=${verificationToken}`;
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
            message: "User created successfully. Please check your email for verification.",
            token,
        });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ error: "Failed to create user. Please try again." });
    }
};

export const verifyEmail = async (req: Request, res: Response) : Promise<any> => {
    const { token } = req.query;
    try {
        const user = await User.findOne({ verificationToken: token });
        if (!user) {
            return res.status(404).json({ error: "Invalid or expired token" });
        }

        user.isVerified = true;
        user.verificationToken = null;
        await user.save();

        res.status(200).json({ message: "Email verified successfully" });
    } catch (error) {
        console.error("Error verifying email:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const localLogin = async (req: Request, res: Response) : Promise<any> => {
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
    
    res.json({
        message: "Google login successful",
        token,
    });
};
