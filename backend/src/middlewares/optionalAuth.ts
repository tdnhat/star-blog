import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

export const optionalAuth = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(" ")[1];
        try {
            const decoded = await verifyToken(token);
            req.user = decoded;
        } catch (err) {
            console.log("Invalid token, continuing as guest.");
        }
    }

    next();
};
