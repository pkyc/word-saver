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

module.exports = async (req, res) => {
    if (req.method === 'POST') {
        const { word } = req.body;
        try {
            await pool.query('INSERT INTO words (word) VALUES ($1)', [word]);
            res.status(201).send('Word saved');
        } catch (err) {
            console.error('Error executing query:', err); // Log detailed error
            res.status(500).send('Error saving word');
        }
    } else {
        res.status(405).send('Method Not Allowed');
    }
};
