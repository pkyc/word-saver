const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();

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

app.use(express.json());

app.get('/api/merchandizer-suggestions', async (req, res) => {
    const query = req.query.query || '';

    try {
        const result = await pool.query(
            'SELECT DISTINCT merchandizer FROM items WHERE merchandizer ILIKE $1 LIMIT 10',
            [`${query}%`]
        );

        const suggestions = result.rows.map(row => row.merchandizer);
        res.json(suggestions);
    } catch (err) {
        console.error('Error fetching suggestions:', err.message);
        res.status(500).send('Error fetching suggestions');
    }
});

module.exports = app;
