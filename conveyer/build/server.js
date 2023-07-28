import express from 'express';
import { conveyerRouter } from './routes/conveyor.js';
import { BadRequestError } from './errors/errorClasses.js';
const app = express();
app.use(express.json());
app.use('/conveyor', conveyerRouter);
const errorHandler = (err, req, res, next) => {
    if (err instanceof BadRequestError) {
        res.status(400).json({ error: err.message });
    }
    else {
        res.status(500).json({ error: 'Internal server error' });
    }
};
app.use(errorHandler);
const port = 3001;
app.listen((port), () => {
    console.log(`Server is running on http://localhost:${port}`);
});
//# sourceMappingURL=server.js.map