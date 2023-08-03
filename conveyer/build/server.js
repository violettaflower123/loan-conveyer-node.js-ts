import express from 'express';
import { conveyerRouter } from './routes/conveyor.js';
import { BadRequestError } from './errors/errorClasses.js';
import { ResourceNotFoundError, AuthorizationError, ConflictError, ValidationError, ServerError } from './errors/errorClasses.js';
const app = express();
app.use(express.json());
// const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
//     if (err instanceof BadRequestError) {
//       res.status(400).json({ error: err.message });
//     } else {
//       res.status(500).json({ error: 'Internal server error' });
//     }
//     next();
// };
const errorHandler = (err, req, res, next) => {
    if (err instanceof BadRequestError) {
        res.status(400).json({ error: err.message });
    }
    else if (err instanceof ConflictError) {
        res.status(409).json({ error: err.message });
    }
    else if (err instanceof ResourceNotFoundError) {
        res.status(404).json({ error: err.message });
    }
    else if (err instanceof AuthorizationError) {
        res.status(401).json({ error: err.message });
    }
    else if (err instanceof ValidationError) {
        res.status(403).json({ error: err.message });
    }
    else if (err instanceof ServerError) {
        res.status(500).json({ error: err.message });
    }
    else {
        res.status(500).json({ error: 'Internal server error' });
    }
    next();
};
app.use(errorHandler);
app.use('/conveyor', conveyerRouter);
const port = 3001;
app.listen((port), () => {
    console.log(`Server is running on http://localhost:${port}`);
});
//# sourceMappingURL=server.js.map