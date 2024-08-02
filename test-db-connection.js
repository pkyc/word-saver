const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    ssl: {
        rejectUnauthorized: false
    }
});

async function testConnection() {
    try {
        // Connect to the database and fetch the current time
        const timeResult = await pool.query('SELECT NOW()');
        console.log('Connection successful. Current time:', timeResult.rows[0].now);

        // Fetch the last record added to the 'items' table
        const lastRecordResult = await pool.query('SELECT * FROM items ORDER BY id DESC LIMIT 1');
        
        if (lastRecordResult.rows.length > 0) {
            console.log('Last record added:', lastRecordResult.rows[0]);
        } else {
            console.log('No records found in the items table.');
        }

        process.exit(0);
    } catch (err) {
        console.error('Error connecting to the database:', err.stack);
        process.exit(1);
    }
}

testConnection();
