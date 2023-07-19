import express from 'express';
import { conveyerRouter } from "./routes/conveyor.js";
// // import { Pool } from "pg";
// import pkg from 'pg';
// const { Pool } = pkg;
// const pool = new Pool({
//   host: "db",
//   user: "postgres",
//   database: "deals",
//   password: "password",
//   port: 5432
// });
// const connectToDB = async () => {
//   try {
//     await pool.connect();
//   } catch (err) {
//     console.log(err);
//   }
// };
// connectToDB();
const app = express();
app.use(express.json());
app.use('/conveyor', conveyerRouter);
const port = 3001;
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