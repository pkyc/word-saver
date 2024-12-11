import { Client } from 'pg';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { name } = req.query;

  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  const client = new Client({
    connectionString: process.env.NEON_CONNECTION_STRING,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    const result = await client.query('SELECT * FROM items WHERE name = $1', [name]);
    await client.end();

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No record found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
