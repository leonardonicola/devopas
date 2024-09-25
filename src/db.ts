import pg from "pg";
const { Pool } = pg;

const pool = new Pool();

export const query = (text: string, params: any) => pool.query(text, params);

export const closePool = () => pool.end();
