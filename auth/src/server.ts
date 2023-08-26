import express, { Request, Response } from 'express';
import { logger } from './helpers/logger.js';
import { errorHandler } from './helpers/utils.js';
import jwt from 'jsonwebtoken';
import { db } from './db.js';

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
    } catch (err) {
        res.status(500).send('Error creating user');
    }
});

app.post('/login', async (req, res) => {
    const { login, password } = req.body;
    const encodedPassword = Buffer.from(password).toString('base64');

    try {
        const user = await db.oneOrNone('SELECT * FROM users WHERE login = $1 AND password = $2', [login, encodedPassword]);
        if (!user) return res.status(401).send('Authentication failed');

        if (!JWT_SECRET) {
            throw new Error("JWT_SECRET environment variable not set.");
        }

        return res.json({ login: user.login, token: jwt.sign({ id: user.id, login: user.login }, JWT_SECRET, { expiresIn: '10m' }) });
    } catch (err) {
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
