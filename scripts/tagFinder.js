const { Client } = require('pg');
const fs = require('fs');

//dot env config
require('dotenv').config();

const client = new Client({
    host: 'localhost',
    user: 'postgres',
    password: process.env.LOCALPASS,
    database: 'fameflamedb',
});

async function fetchAndProcess() {
    await client.connect();

    const res = await client.query('SELECT name FROM services');
    const strings = res.rows.map(row => row.name);

    let keys = new Set();

    for (let string of strings) {
        let matches = string.match(/\[(.*?)\]/g) || [];
        for (let match of matches) {
            let key;
            if (match.includes(':')) {
                key = match.split(':')[0].trim();
            } else {
                key = match.trim();
            }
            // Remove brackets from key
            key = key.replace('[', '').replace(']', '');
            // Replace hyphens with spaces, remove leading/trailing spaces, and convert to lowercase
            key = key.replace('-', ' ').trim().toLowerCase();
            keys.add(key);
        }
    }
    
    // Convert the keys to an array and join them with newlines
    let keysString = Array.from(keys).join('\n');
    
    // Write the keys to a CSV file
    fs.writeFileSync('names.csv', strings.join('\n'));

    await client.end();
}

fetchAndProcess();