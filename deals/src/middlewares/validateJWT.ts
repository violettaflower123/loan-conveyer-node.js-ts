import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { logger } from '../helpers/logger.js';
import dotenv from 'dotenv';
dotenv.config();

interface RequestWithJWT extends Request {
    email?: string;
}

const JWT_SECRET: string | undefined = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not set');
}
export const validateJWT = async (req: RequestWithJWT, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    console.log("Received token:", token);

    if (!token) {
        return res.status(401).send('Token required');
    }

    if (!JWT_SECRET) {
        console.error('JWT_SECRET is not set');
        return res.status(500).send('Server error');
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        
        if (typeof decoded === 'object' && decoded !== null && 'email' in decoded) {
            req.email = decoded.email;
            console.log("Email set in request object:", (decoded as any).email);
            next();
        } else {
            return res.status(403).send('Invalid token payload');
        }

    } catch (error: any) {
        console.error("Error in validateJWT:", error.message);
        logger.error('Error calculating loan offer', JSON.stringify(error));
        return res.status(403).send('Invalid token');
    }
};