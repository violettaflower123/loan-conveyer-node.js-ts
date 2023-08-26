import express from 'express';
import { logger } from './helpers/logger.js';
import { errorHandler } from './helpers/utils.js';
import jwt from 'jsonwebtoken';
import { db } from './db.js';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
const JWT_SECRET = process.env.JWT_SECRET;
app.use((req, res, next) => {
    logger.info(`Received ${req.method} request for ${req.url}`);
    next();
});
app.use(express.json());
app.use(errorHandler);
app.post('/register', async (req, res) => {
    const { login, password } = req.body;
    const encodedPassword = Buffer.from(password).toString('base64');
    try {
        await db.none('INSERT INTO users(login, password) VALUES($1, $2)', [login, encodedPassword]);
        res.status(201).send('User created');
    }
    catch (err) {
        if (err.code === '23505') {
            res.status(409).send('User with this login already exists');
        }
        else {
            logger.error(err);
            res.status(500).send('Error creating user');
        }
    }
});
app.post('/login', async (req, res) => {
    const { login, password } = req.body;
    const encodedPassword = Buffer.from(password).toString('base64');
    try {
        const user = await db.oneOrNone('SELECT * FROM users WHERE login = $1 AND password = $2', [login, encodedPassword]);
        if (!user)
            return res.status(401).send('Authentication failed');
        if (!JWT_SECRET) {
            throw new Error("JWT_SECRET environment variable not set.");
        }
        const tokenPayload = { id: user.id, login: user.login };
        const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '10m' });
        return res.json({ login: user.login, token });
    }
    catch (err) {
        logger.error("Error during authentication:", err.message, err.stack);
        return res.status(403).send('Error during authentication');
    }
});
app.post('/validate-token', (req, res) => {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (!token)
        return res.status(401).send('Token required');
    if (!JWT_SECRET) {
        throw new Error("JWT_SECRET environment variable not set.");
    }
    jwt.verify(token, JWT_SECRET, (err) => {
        if (err)
            return res.status(403).send('Invalid token');
        return res.send('Token is valid');
    });
    return res.status(500).send('Unknown error');
});
const port = 3006;
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
//# sourceMappingURL=server.js.map