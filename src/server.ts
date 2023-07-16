import express from 'express';
import { conveyerRouter } from "./routes/conveyor.js";

const app = express();

app.use(express.json());

app.use('/conveyor', conveyerRouter);

const port = 3000;
app.listen((port), () => {
    console.log(`Server is running on http://localhost:${port}`)
})

