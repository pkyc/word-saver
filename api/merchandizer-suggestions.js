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
    if (req.method === 'GET') {
        const { query } = req.query;
        try {
            const result = await pool.query(
                'SELECT DISTINCT merchandizer FROM items WHERE merchandizer ILIKE $1 LIMIT 10',
                [`%${query}%`]
            );
            res.status(200).json(result.rows.map(row => row.merchandizer));
        } catch (err) {
            console.error('Error fetching suggestions:', err.stack); // Log detailed error
            res.status(500).json({ error: 'Error fetching suggestions', details: err.message });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
};
