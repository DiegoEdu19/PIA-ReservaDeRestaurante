const pg = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new pg.Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST, 
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

module.exports = { pool };