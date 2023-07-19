import express from 'express';
import { conveyerRouter } from "./routes/conveyor.js";
import dotenv from "dotenv";
dotenv.config();
// import { Pool } from "pg";
import pkg from 'pg';
const { Pool } = pkg;
const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || "5432")
});
const connectToDB = async () => {
    try {
        await pool.connect();
    }
    catch (err) {
        console.log(err);
    }
};
connectToDB();
const app = express();
app.use(express.json());
app.use('/conveyor', conveyerRouter);
const port = process.env.PORT || 3000;
app.listen((port), () => {
    console.log(`Server is running on http://localhost:${port}`);
});
// "scripts": {
//   "dev": "npx nodemon",
//   "build": "rimraf ./build && npx tsc",
//   "start": "npm run build && node build/index",
//   "lint": "npx eslint ./src",
//   "format": "npx eslint ./src --fix"
// },
//# sourceMappingURL=server.js.map