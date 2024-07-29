const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
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

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.post('/api/save-word', async (req, res) => {
    console.log('Received request on /api/save-word'); // Log request receipt
    const { word } = req.body;
    console.log('Received word:', word); // Log received word
    try {
        await pool.query('INSERT INTO words (word) VALUES ($1)', [word]);
        res.status(201).send('Word saved');
    } catch (err) {
        console.error('Error executing query:', err.stack); // Log detailed error
        res.status(500).send('Error saving word');
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
