require('dotenv').config();
const DB_CONFIG = process.env.DB_CONFIG || 'postgresql://postgres:postgres@localhost:5432/plantsdb';
const { Pool } = require('pg');

const pgconn = new Pool({
    connectionString: DB_CONFIG,
    ssl: false,
});
  
module.exports = { pgconn }