import express, { Request, Response, NextFunction } from 'express';
import axios, { AxiosResponse } from 'axios';
import cors from 'cors';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import { errorHandler } from './helpers/utils';
import { services } from './helpers/services';
import { db } from './db';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
dotenv.config();

const app = express();
const PORT: number = 3005;

const JWT_SECRET: string | undefined = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not set');
  }

app.use(cors());
app.use(helmet());
app.use(bodyParser.json());

app.post('/document/:applicationId/send', async (req, res, next) => {
    try {
        const { applicationId } = req.params;
        const response = await axios.post(`http://api-deals:3002/deal/document/${applicationId}/send`, req.body);
        res.json(response.data);
    } catch (error: any) {
        next(error);
    }
});

app.put('/application/apply', async (req, res, next) => {
    try {
        const response = await axios.put('http://api-application:3003/application/offer', req.body);
        res.json(response.data);
    } catch (error: any) {
        next(error);
    }
});

app.put('/application/registration/:applicationId', async (req, res, next) => {
    try {
        const { applicationId } = req.params;
        const response = await axios.put(`http://api-deals:3002/deal/calculate/${applicationId}`, req.body);
        res.json(response.data);
    } catch (error: any) {
        next(error);
    }
});

app.put('/document/:applicationId', async (req, res, next) => {
    try {
        const { applicationId } = req.params;
        const response = await axios.put(`http://api-deals:3002/deal/document/${applicationId}/send`, req.body);
        res.json(response.data);
    } catch (error: any) {
        next(error);
    }
});

app.put('/document/:applicationId/sign', async (req, res, next) => {
    try {
        const { applicationId } = req.params;
        const response = await axios.put(`http://api-deals:3002/deal/document/${applicationId}/sign`, req.body);
        res.json(response.data);
    } catch (error: any) {
        next(error);
    }
});

app.put('/document/:applicationId/sign/code', async (req, res, next) => {
    try {
        const { applicationId } = req.params;
        const response = await axios.put(`http://api-deals:3002/deal/document/${applicationId}/code`, req.body);
        res.json(response.data);
    } catch (error: any) {
        next(error);
    }
});

async function validateJWT(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).send('Token required');
    }

    try {
        const response = await axios.post('http://api-auth:3006/validate-token', {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.data === 'Token is valid') {
            if (!JWT_SECRET) {
                throw new Error('JWT_SECRET is not set');
            }
            const decoded = jwt.verify(token, JWT_SECRET);
            
            if (typeof decoded === 'object' && decoded !== null && 'email' in decoded) {
                const email = (decoded as any).email;

                const client: any = await db.oneOrNone('SELECT * FROM client WHERE email = $1', [email]);
                if (!client) return res.status(403).send('Access denied');

                (req as any).clientId = client.client_id;
                next();
            } else {
                return res.status(403).send('Invalid token payload');
            }
        } else {
            return res.status(403).send('Invalid token');
        }
    } catch (error) {
        return res.status(500).send('Error validating token');
    }
}


app.use('/deal', validateJWT);
app.use('/conveyor', validateJWT);
app.use('/application', validateJWT);

services.forEach(service => {
    app.use(service.route, async (req: Request, res: Response, next: NextFunction) => {
        try {
            const response: AxiosResponse = await axios({
                method: req.method,
                url: `${service.baseUrl}${req.url}`,
                data: req.body,
                headers: {
                    Authorization: req.headers.authorization || ''
                }
            });
            res.json(response.data);
        } catch (error: any) {
            next(error);
        }
    });
});

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`);
});

// {
//     "email": "vitaminka_94@mail.ru",
//     "password": "12345"
// }
