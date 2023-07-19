import express from 'express';
const app = express();
app.use(express.json());
// // import { Pool } from "pg";
import pkg from 'pg';
const { Pool } = pkg;
const pool = new Pool({
    host: "db",
    user: "postgres",
    database: "deals",
    password: "password",
    port: 5432
});
// const connectToDB = async () => {
//   try {
//     await pool.connect();
//   } catch (err) {
//     console.log(err);
//   }
// };
// connectToDB();
app.get('/deals', (req, res) => {
    console.log('jhgjhjhb');
    // try {
    //   const client = await pool.connect();
    //   const genders = await client.query('SELECT * FROM gender');
    //   const maritalStatuses = await client.query('SELECT * FROM marital_status');
    //   const employmentStatuses = await client.query('SELECT * FROM employment_status');
    //   const employmentPositions = await client.query('SELECT * FROM employment_position');
    //   const applicationStatuses = await client.query('SELECT * FROM application_status');
    //   const changeTypes = await client.query('SELECT * FROM change_type');
    //   const creditStatuses = await client.query('SELECT * FROM credit_status');
    //   client.release();
    //   res.json({
    //     genders: genders.rows,
    //     maritalStatuses: maritalStatuses.rows,
    //     employmentStatuses: employmentStatuses.rows,
    //     employmentPositions: employmentPositions.rows,
    //     applicationStatuses: applicationStatuses.rows,
    //     changeTypes: changeTypes.rows,
    //     creditStatuses: creditStatuses.rows,
    //   });
    // } catch (error) {
    //   console.error('Error running query', error);
    //   res.status(500).json({ error: 'Internal Server Error' });
    // }
});
const port = 3002;
app.listen((port), () => {
    console.log(`Server is running on http://localhost:${port}`);
});
//# sourceMappingURL=server.js.map