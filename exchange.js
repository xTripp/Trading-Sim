require('dotenv').config();
const finnhub = require('finnhub');

const api_key = finnhub.ApiClient.instance.authentications['api_key'];
api_key.apiKey = process.env.API_KEY;
const finnhubClient = new finnhub.DefaultApi();

function getPrice(symbol, vals=['c']) {
    finnhubClient.quote(symbol, (err, data, response) => {
        if (err) {
            console.error(`Error ${err.status}: ${err}`);
            return;
        }

        const info = Array.from(Object.keys(data)).filter(val => val in vals);
        return info;
    })
}

function apiStats() {
    console.log(response.headers['x-ratelimit-remaining']);
    console.log(response.headers['x-ratelimit-reset']);
}

module.exports = {
    getPrice
};