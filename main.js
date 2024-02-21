require('dotenv').config();
const finnhub = require('finnhub');

const api_key = finnhub.ApiClient.instance.authentications['api_key'];
api_key.apiKey = process.env.API_KEY;
const finnhubClient = new finnhub.DefaultApi();

function getPrice(symbol) {
    finnhubClient.quote(symbol, (err, data, response) => {
        if (err) {
            console.error(`Error: ${err}`);
            console.error(err.status);
            return;
        }
        console.log(response.headers['x-ratelimit-remaining']);
        console.log(response.headers['x-ratelimit-reset']);
        console.log(data);
    })
}

setInterval(() => {
    getPrice('COIN');
}, 800);