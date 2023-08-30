import express, { NextFunction, Request, Response } from 'express';
import { logger } from './helpers/logger.js';
import { errorHandler } from './helpers/utils.js';
import jwt from 'jsonwebtoken';
import { db } from './db.js';
import { User, TokenPayload } from './types.js';
import bcrypt from 'bcrypt'; 
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const JWT_SECRET: string | undefined = process.env.JWT_SECRET;

app.use((req: Request, res: Response, next: NextFunction) => {
    logger.info(`Received ${req.method} request for ${req.url}`);
    next();
});

app.use(express.json());
app.use(errorHandler);


app.post('/register', async (req: Request, res: Response) => {
    const { password, email } = req.body;
    const encodedPassword = Buffer.from(password).toString('base64');

    try {
        await db.none('INSERT INTO users(password, email) VALUES($1, $2)', [encodedPassword, email]);
        res.status(201).send('User created');
    } catch (err: any) {
        if (err.code === '23505') {
            res.status(409).send('User with this login already exists'); 
        } else {
            logger.error(err);
            res.status(500).send('Error creating user');
        }
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    const encodedPassword = Buffer.from(password).toString('base64');
    try {
        const user: User | null = await db.oneOrNone('SELECT * FROM users WHERE email = $1 AND password = $2', [email, encodedPassword]);
        if (!user) return res.status(401).send('Authentication failed');

        if (!JWT_SECRET) {
            throw new Error("JWT_SECRET environment variable not set.");
        }

        const tokenPayload: TokenPayload = { id: user.id, email: user.email };
        const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '50m' });
        return res.json({ login: user.email, token });
    } catch (err: any) {
        logger.error("Error during authentication:", err.message, err.stack);
        return res.status(403).send('Error during authentication');
    }
});

app.post('/validate-token', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).send('Token required');

    if (!JWT_SECRET) {
        throw new Error("JWT_SECRET environment variable not set.");
    }
    jwt.verify(token, JWT_SECRET, (err) => {
        if (err) return res.status(403).send('Invalid token');
        return res.send('Token is valid');
    });

    return res.status(500).send('Unknown error');
});


const port: number = 3006;
app.listen((port), () => {
    logger.info(`Server is running on http://localhost:${port}`);
});

// пример
// {
//     "login": "violetta1234",
//     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibG9naW4iOiJ2aW9sZXR0YTEyMzQiLCJpYXQiOjE2OTMwNjA3MjcsImV4cCI6MTY5MzA2MTMyN30.pxT9dFeNSpJU9dqV43zfAM0rpqaNaueZjJZ5WxGhjv8"
// }
// {
//     "login": "violetta1234",
//     "password": "istanbul111"
// }
