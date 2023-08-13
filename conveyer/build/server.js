import express from 'express';
import { conveyerRouter } from './routes/conveyor.js';
import { logger } from './helpers/logger.js';
import { errorHandler } from './helpers/utils.js';
const app = express();
app.use((req, res, next) => {
    logger.info(`Received ${req.method} request for ${req.url}`);
    next();
});
app.use(express.json());
app.use('/conveyor', conveyerRouter);
app.use(errorHandler);
const port = 3001;
app.listen((port), () => {
    logger.info(`Server is running on http://localhost:${port}`);
});
//# sourceMappingURL=server.js.map