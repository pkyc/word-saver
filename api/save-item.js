const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

require('dotenv').config();

console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_PORT:', process.env.DB_PORT);
console.error('Error connecting to the database:');

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


module.exports = async (req, res) => {

    const express = require('express');
    const { Pool } = require('pg');
    const cors = require('cors');
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
    
    console.log('DB_HOST:', process.env.DB_HOST);
    console.log('DB_USER:', process.env.DB_USER);
    console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
    console.log('DB_NAME:', process.env.DB_NAME);
    console.log('DB_PORT:', process.env.DB_PORT);
    
    app.use(cors());
    app.use(express.json());
    app.use(express.static('public'));

    
    console.log('Received request:', req.method, req.url);

    if (req.method === 'POST') {
        console.log('Request body:', req.body);

        const { item_name, price, quantity, unit_price, merchandizer, date } = req.body;

        try {
            console.log('Inserting Xxxx data into database...');
            await pool.query(
                'INSERT INTO items (name, price, quantity, unit_price, merchandizer, date) VALUES ($1, $2, $3, $4, $5, $6)',
                [item_name, price, quantity, unit_price, merchandizer, date]
            );
            console.log('Data inserted successfully');
            res.status(201).send('Item saved successfully');
        } catch (err) {
            console.error('Error executing query:', err.message);
            console.error('Stack trace:', err.stack);
            res.status(500).json({ error: 'Error saving item', message: err.message, stack: err.stack });
        }
    } else {
        console.log('Method not allowed:', req.method);
        res.status(405).send('Method Not Allowed');
    }
};
