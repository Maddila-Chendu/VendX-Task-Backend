import { Pool } from 'pg';

export const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "Task-Manager-DB",
  password: "Chendu",
  port: 5432,
});