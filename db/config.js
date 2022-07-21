require('dotenv').config();
const DB_CONFIG = process.env.DATABASE_URL;

const { Pool } = require('pg');

const pgconn = new Pool({
    connectionString: DB_CONFIG,
    ssl: {
      rejectUnauthorized: false
    }
});
  
module.exports = { pgconn }

