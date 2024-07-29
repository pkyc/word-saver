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
        const { item_name, price, quantity, unit_price, merchandizer, date } = req.body;
        try {
            await pool.query(
                'INSERT INTO items (item_name, price, quantity, unit_price, merchandizer, date) VALUES ($1, $2, $3, $4, $5, $6)',
                [item_name, price, quantity, unit_price, merchandizer, date]
            );
            res.status(201).send('Item saved successfully');
        } catch (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Error saving item');
        }
    } else {
        res.status(405).send('Method Not Allowed');
    }
};
