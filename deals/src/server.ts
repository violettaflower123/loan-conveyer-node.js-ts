import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import pgPromise from 'pg-promise';
import { dealRouter  } from './routes/deal.js';

const app = express();
app.use(bodyParser.json());

app.use(function(err: any, req: Request, res: Response, next: Function) {
    if (err instanceof pgPromise.errors.QueryResultError) {
        return res.status(500).json({ error: 'Database query error.' });
    }

    if ('response' in err) {
        console.log(err.response.data);
        return res.status(400).json({ error: err.response.data.error });
    }

    return res.status(500).json({ error: 'An unexpected error occurred.' });
});

app.use('/deal', dealRouter);


const port: number = 3002;
app.listen((port), () => {
    console.log(`Server is running on http://localhost:${port}`)
})
