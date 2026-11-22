import mysql from 'mysql2/promise';
import { config } from '../config/index.js';

export const pool = mysql.createPool({
  host: config.dbHost,
  port: config.dbPort,
  user: config.dbUser,
  password: config.dbPassword,
  database: config.dbName,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  namedPlaceholders: true,
});

export async function query(sql, params) {
  const start = Date.now();
  const [rows] = await pool.execute(sql, params);
  const duration = Date.now() - start;
  if (config.nodeEnv !== 'production') {
    console.log('Executed query', { sql: sql.substring(0, 100), duration, rows: rows.length });
  }
  return { rows, rowCount: rows.length };
}

export async function getClient() {
  return pool.getConnection();
}