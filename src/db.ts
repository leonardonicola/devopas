import pg from "pg";

const { Pool } = pg;
const config = {
  host: "postgres",
  port: Number(process.env.PGPORT),
  password: process.env.PGPASSWORD!,
  database: process.env.PGDATABASE!,
  user: process.env.PGUSER!,
};
const pool = new Pool(config);

export const query = (text: string, params: any) => pool.query(text, params);

export const closePool = () => pool.end();
