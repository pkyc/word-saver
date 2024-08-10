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
        const sqlQuery = 'SELECT DISTINCT name FROM items';
        const values = [`%${query}%`];

        console.log('Executing query:', sqlQuery);
        console.log('With values:', values);

        try {
            const result = await pool.query(sqlQuery, values);
            console.log('Query result:', result.rows);
            res.status(200).json(result.rows.map(row => row.merchandizer));
        } catch (err) {
            console.error('Error fetching suggestions:', err.stack); // Log detailed error
            res.status(500).json({ error: 'Error fetching suggestions', details: err.message });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
};

/* */
app.get('/showall', (req, res) => {
  let html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Item List</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              margin: 20px;
          }
          table {
              width: 100%;
              border-collapse: collapse;
          }
          th, td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
          }
          th {
              background-color: #f2f2f2;
          }
      </style>
  </head>
  <body>

      <h1>Item List</h1>
      <table>
          <thead>
              <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Description</th>
              </tr>
          </thead>
          <tbody>
  `;

  items.forEach(item => {
    html += `
    <tr>
        <td>${item.name}</td>
     /tr>
    `;
  });

  html += `
          </tbody>
      </table>

  </body>
  </html>
  `;

  res.send(html);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});