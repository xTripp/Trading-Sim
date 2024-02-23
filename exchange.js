require('dotenv').config();
const finnhub = require('finnhub');

const api_key = finnhub.ApiClient.instance.authentications['api_key'];
api_key.apiKey = process.env.API_KEY;
const finnhubClient = new finnhub.DefaultApi();

function getPrice(symbol, vals=['c'], callback) {
    finnhubClient.quote(symbol, (err, data, response) => {
        if (err) {
            console.error(`Error status ${err.status}: ${err}`);
            callback(err, vals);
            return;
        }

        const info = Object.fromEntries(
            Object.keys(data).filter(key => vals.includes(key)).map(key => [key, data[key]])
        );
        callback(null, info);
    });
}

function apiStats() {
    console.log(response.headers['x-ratelimit-remaining']);
    console.log(response.headers['x-ratelimit-reset']);
}

module.exports = {
    getPrice
};