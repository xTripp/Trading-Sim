const finnhubClient = require('./server.js');
let apiCalls = 0;
let apiReset = 0;

function getQuote(symbol, vals = ['c']) {
    return new Promise((resolve) => {
        finnhubClient.quote(symbol, (err, data, response) => {
            if (err) {
                console.error(`Error status ${err.status}: ${err}`);
                resolve(Object.fromEntries(Object.keys(data).filter(key => vals.includes(key)).map(key => [key, 0.00])));
            } else {
                resolve(Object.fromEntries(Object.keys(data).filter(key => vals.includes(key)).map(key => [key, data[key]])));
            }
            apiStats(response);
        });
    });
}


function apiStats(response) {
    apiCalls = response.headers['x-ratelimit-remaining'];
    apiReset = response.headers['x-ratelimit-reset']
}

module.exports = {
    apiCalls,
    apiReset,
    getQuote
};