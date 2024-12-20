// Importing postgres pool for connection
const { Pool } = require('pg');

// Creating connection pool for database using .env file
const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

// Initializing database by creating jokes table if it doesn't exist
const initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS jokes (
        id SERIAL PRIMARY KEY,
        type VARCHAR(10) NOT NULL,
        category VARCHAR(50) NOT NULL,
        joke TEXT,
        setup TEXT,
        delivery TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);// note that I made one column 'joke' which is for single line jokes and setup and delivery is the two-line equivalent
    console.log('Database initialized');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

// Running the database
initDB();

//Exporting for use in index.js
module.exports = pool;