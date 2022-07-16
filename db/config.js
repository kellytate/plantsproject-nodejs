require('dotenv').config();
// const DB_CONFIG = process.env.DB_CONFIG || 'postgresql://postgres:postgres@localhost:5432/plantsdb';
// const { Pool } = require('pg');

// const pgconn = new Pool({
//     connectionString: DB_CONFIG,
//     ssl: false,
// });

const Knex = require('knex');
const createUnixSocketPool = async config => {
  const dbSocketPath = process.env.DB_SOCKET_PATH || '/cloudsql';

  const DB_USER = 'postgres';
  const DB_PASS = 'plants';
  const DB_NAME = 'plantsdb';
  const INSTANCE_CONNECTION_NAME = 'plantsapp-356420:us-east1:plantsdb';
  // Establish a connection to the database
  return Knex({
    client: 'pg',
    connection: {
      user: process.env.DB_USER, // e.g. 'my-user'
      password: process.env.DB_PASS, // e.g. 'my-user-password'
      database: process.env.DB_NAME, // e.g. 'my-database'
      host: `${dbSocketPath}/${process.env.INSTANCE_CONNECTION_NAME}`,
    },
    // // ... Specify additional properties here.
    // ...config,
  });

};

  
module.exports = { pgconn }