require('dotenv').config();
const axios = require('axios');


async function fetchData() {
    const japkey = process.env.JAP_API_KEY;
    const response = await axios.post('https://justanotherpanel.com/api/v2', {
        key: japkey,
        action: 'services',
    });

    console.log(response)
}

fetchData();