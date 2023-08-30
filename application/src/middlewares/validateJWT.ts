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
console.log('secret', JWT_SECRET)

export async function validateJWT(req: RequestWithJWT, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1];
    console.log("Received token:", token);

    if (!token) {
        return res.status(401).send('Token required');
    }

    try {
        if (!JWT_SECRET) {
            console.error('JWT_SECRET is not set');
            return res.status(500).send('Server error');
        }
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                console.log("JWT verification error:", err);
                return res.status(403).send('Invalid token');
            } else {
                if (typeof decoded === 'object' && decoded !== null && 'email' in decoded) {
                    const email = (decoded as any).email;
                    console.log("Email set in request object:", (decoded as any).email);
                    (req as any).email = email;
                    next();
                } else {
                    return res.status(403).send('Email is required in token payload');
                }
            }
        });
    } catch (error: any) {
        console.error("Error in validateJWT:", error.message);
        return res.status(500).send('Error validating token');
    }
}
