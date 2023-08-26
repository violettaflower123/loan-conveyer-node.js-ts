import express, { Request, Response, NextFunction } from 'express';
import axios, { AxiosResponse } from 'axios';
import cors from 'cors';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import { errorHandler } from './helpers/utils';
import { services } from './helpers/services';

const app = express();
const PORT: number = 3005;

app.use(cors());
app.use(helmet());
app.use(bodyParser.json());

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
            next();
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

