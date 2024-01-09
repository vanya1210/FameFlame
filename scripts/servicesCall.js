require('dotenv').config();
const axios = require('axios');
const { Pool } = require('pg');

// PostgreSQL database connection
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'fameflamedb',
  password: process.env.LOCALPASS,
  port: 5432,
});

const socialMediaPlatforms = ['Facebook', 'Instagram', 'Twitter', 'LinkedIn', 'Snapchat', 'TikTok', 'YouTube', 'Spotify', 'Twitch', 'Telegram'];
function refineCategory(category) {
  let categoryRefined = 'other';
  for (let platform of socialMediaPlatforms) {
    let regex = new RegExp(platform, 'i');
    if (regex.test(category)) {
      categoryRefined = platform;
      console.log(categoryRefined);
      break;
    }
  }
  return categoryRefined;
}

async function fetchDataAndInsert() {
  try {
    const japkey = process.env.JAP_API_KEY;
    const response = await axios.post('https://justanotherpanel.com/api/v2', {
      key: japkey,
      action: 'services'
    });
    const data = response.data;




    data.forEach(async (item) => {

      const refinedCategory = refineCategory(item.category);

      const query = `
      INSERT INTO services(service, name, type, rate, min, max, dripfeed, refill, cancel, category, category_refined)
      VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      ON CONFLICT (service) 
      DO UPDATE SET 
        name = EXCLUDED.name, 
        type = EXCLUDED.type, 
        rate = EXCLUDED.rate, 
        min = EXCLUDED.min, 
        max = EXCLUDED.max, 
        dripfeed = EXCLUDED.dripfeed, 
        refill = EXCLUDED.refill, 
        cancel = EXCLUDED.cancel, 
        category = EXCLUDED.category,
        category_refined = EXCLUDED.category_refined
    `;
      const values = [item.service, item.name, item.type, item.rate, item.min, item.max, item.dripfeed, item.refill, item.cancel, item.category, refinedCategory];

      await pool.query(query, values);
    });

    console.log('Data inserted into database');
  } catch (error) {
    console.error(error);
  }
}

fetchDataAndInsert();