const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'fameflamedb',
  password: process.env.LOCALPASS,
  port: 5432,
});

const socialMediaPlatforms = ['Facebook', 'Instagram', 'Twitter', 'LinkedIn', 'Snapchat', 'TikTok']; // Add more as needed

async function refineCategories() {
  await client.connect();

  const res = await client.query('SELECT * FROM services');
  for (let row of res.rows) {
    let categoryRefined = 'other';
    for (let platform of socialMediaPlatforms) {
      let regex = new RegExp(platform, 'i');
      if (regex.test(row.category)) {
        categoryRefined = platform;
        break;
      }
    }

    await client.query('UPDATE services SET category_refined = $1 WHERE id = $2', [categoryRefined, row.id]);
  }

  await client.end();
}

refineCategories().catch(e => console.error(e.stack));