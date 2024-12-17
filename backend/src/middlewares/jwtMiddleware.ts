import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

export const jwtMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            res.status(401).json({ message: "No token provided" });
            return;
        }

        const decoded = await verifyToken(token);
        req.user = decoded;
        next();
    } catch {
        res.status(401).json({ message: "Invalid token" });
    }
};
