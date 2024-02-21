require('dotenv').config();
const finnhub = require('finnhub');

const api_key = finnhub.ApiClient.instance.authentications['api_key'];
api_key.apiKey = process.env.API_KEY;
const finnhubClient = new finnhub.DefaultApi();

function getPrice(symbol) {
    try {
        finnhubClient.quote(symbol, (err, data, response) => {
            if (err) {
                console.log(err.status);
            }
            console.log(data);
        })
    } catch(err) {
        console.error(`Error: ${err}`);
    }
}

setInterval(() => {
    getPrice('COIN');
}, 100);