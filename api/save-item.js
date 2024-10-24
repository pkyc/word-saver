const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

require('dotenv').config();

console.log('Server starting...');
console.log('Environment variables:');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '[REDACTED]' : 'Not set');

const app = express();
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

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

async function testDatabaseConnection() {
  try {
    const client = await pool.connect();
    console.log('Successfully connected to the database');
    const result = await client.query('SELECT NOW()');
    console.log('Database query result:', result.rows[0]);
    client.release();
  } catch (err) {
    console.error('Error connecting to the database:', err);
  }
}

testDatabaseConnection();

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'An unexpected error occurred', details: err.message });
});

module.exports = async (req, res) => {
    console.log('Received request:', req.method, req.url);

    if (req.method === 'POST') {
        console.log('Request body:', req.body);

        const { item_name, price, quantity, unit_price, merchandizer, date } = req.body;
        
        console.log('Attempting database insertion with data:', { item_name, price, quantity, unit_price, merchandizer, date });

        try {
            console.log('Inserting data into database...');
            await pool.query(
                'INSERT INTO items (name, price, quantity, unit_price, merchandizer, date) VALUES ($1, $2, $3, $4, $5, $6)',
                [item_name, price, quantity, unit_price, merchandizer, date]
            );
            console.log('Data inserted successfully');
            res.status(201).json({ message: 'Item saved successfully' });
        } catch (err) {
            console.error('Error executing query:', err.message);
            console.error('Stack trace:', err.stack);
            res.status(500).json({ error: 'Error saving item', message: err.message });
        }
    } else {
        console.log('Method not allowed:', req.method);
        res.status(405).json({ error: 'Method Not Allowed' });
    }
};

// If you want to start the server explicitly (e.g., for local testing)
// Uncomment the following lines:
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });

