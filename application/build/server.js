import express from 'express';
import bodyParser from 'body-parser';
import { applicationRouter } from './routes/application.js';
const app = express();
app.use(bodyParser.json());
app.use('/application', applicationRouter);
const port = 3003;
app.listen((port), () => {
    console.log(`Server is running on http://localhost:${port}`);
});
//# sourceMappingURL=server.js.map