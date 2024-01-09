const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

require('dotenv').config();

const url = 'https://justanotherpanel.com/services';

axios.get(url, {
    headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'es-ES,es;q=0.9',
        'Cache-Control': 'max-age=0',
        'Connection': 'keep-alive',
        'Cookie': process.env.JAP_COOKIES,
        'Host': 'justanotherpanel.com',
        'Referer': 'https://justanotherpanel.com/',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'same-origin',
        'Sec-Fetch-User': '?1',
        'Upgrade-Insecure-Requests': '1',
        'User-Agent': 'Mozilla/5.0 (X11; Linux aarch64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.188 Safari/537.36 CrKey/1.54.250320'
}
}).then(response => {
    const html = response.data;
    const $ = cheerio.load(html);
    const tbodyContent = $('tbody').html();

    fs.writeFile('output.html', tbodyContent, (err) => {
        if (err) {
            console.error(err);
        } else {
            console.log('File successfully written!');
        }
    });
}).catch(error => {
    console.error(error);
});