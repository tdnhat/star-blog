import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export const signToken = (payload: Object, expiresIn = '1h') => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

export const verifyToken = (token: string) => {
    return jwt.verify(token, JWT_SECRET);
}