const { Client } = require('pg');
const fs = require('fs');
const cheerio = require('cheerio');

require('dotenv').config();

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'fameflamedb',
    password: process.env.LOCALPASS,
  });

client.connect();

fs.readFile('./output.html', 'utf8', (err, html) => {
    if (err) {
        console.error(err);
        return;
    }
    const $ = cheerio.load(html);
    let pendingUpdates = 0;
    $('a').each(function() {
        var dataService = $(this).attr('data-service');
        var dataDescription = $(this).attr('data-description');
        if (dataService && dataDescription) {
            pendingUpdates++;
            client.query('UPDATE services SET description = $1 WHERE service = $2', [decodeURIComponent(dataDescription), dataService])
                .then(() => {
                    pendingUpdates--;
                    if (pendingUpdates === 0) {
                        client.end();
                    }
                })
                .catch(err => {
                    console.error(err);
                });
        }
    });
});