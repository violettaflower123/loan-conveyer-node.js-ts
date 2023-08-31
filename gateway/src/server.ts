import express, { Request, Response, NextFunction } from 'express';
import axios, { AxiosResponse } from 'axios';
import cors from 'cors';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import { errorHandler } from './helpers/utils';
import { services } from './helpers/services';
import { db } from './db';
import dotenv from 'dotenv';
import { logger } from './helpers/logger';
import jwt from 'jsonwebtoken';
interface RequestWithJWT extends Request {
    email?: string;
}
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
        const config = {
            headers: {
                'Authorization': req.headers.authorization || ''
            }
        };
        const { applicationId } = req.params;
        const response = await axios.post(`http://api-deals:3002/deal/document/${applicationId}/send`, req.body, config);
        res.json(response.data);
    } catch (error: any) {
        next(error);
    }
});

app.put('/application/apply', async (req, res, next) => {
    try {
        const config = {
            headers: {
                'Authorization': req.headers.authorization || ''
            }
        };
        const response = await axios.put('http://api-application:3003/application/offer', req.body, config);
        // const response = await axios.put('http://api-application:3003/application/offer', req.body);
        res.json(response.data);
        // res.json(response.data);
    } catch (error: any) {
        next(error);
        console.log(error);
    }
});

app.put('/application/registration/:applicationId', async (req, res, next) => {
    try {
        const config = {
            headers: {
                'Authorization': req.headers.authorization || ''
            }
        };
        const { applicationId } = req.params;
        const response = await axios.put(`http://api-deals:3002/deal/calculate/${applicationId}`, req.body, config);
        res.json(response.data);
    } catch (error: any) {
        next(error);
    }
});

app.put('/document/:applicationId', async (req, res, next) => {
    try {
        const config = {
            headers: {
                'Authorization': req.headers.authorization || ''
            }
        };
        const { applicationId } = req.params;
        const response = await axios.put(`http://api-deals:3002/deal/document/${applicationId}/send`, req.body, config);
        res.json(response.data);
    } catch (error: any) {
        next(error);
    }
});

app.put('/document/:applicationId/sign', async (req, res, next) => {
    try {
        const config = {
            headers: {
                'Authorization': req.headers.authorization || ''
            }
        };
        const { applicationId } = req.params;
        const response = await axios.put(`http://api-deals:3002/deal/document/${applicationId}/sign`, req.body, config);
        res.json(response.data);
    } catch (error: any) {
        next(error);
    }
});

app.put('/document/:applicationId/sign/code', async (req, res, next) => {
    try {
        const config = {
            headers: {
                'Authorization': req.headers.authorization || ''
            }
        };
        const { applicationId } = req.params;
        const response = await axios.put(`http://api-deals:3002/deal/document/${applicationId}/code`, req.body, config);
        res.json(response.data);
    } catch (error: any) {
        next(error);
    }
});



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
