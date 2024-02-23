const finnhubClient = require('./server.js');

function getQuote(symbol, vals = ['c']) {
    return new Promise((resolve) => {
        finnhubClient.quote(symbol, (err, data, response) => {
            if (err) {
                console.error(`Error status ${err.status}: ${err}`);
                resolve(Object.fromEntries(Object.keys(data).filter(key => vals.includes(key)).map(key => [key, 0.00])));
            } else {
                resolve(Object.fromEntries(Object.keys(data).filter(key => vals.includes(key)).map(key => [key, data[key]])));
            }
        });
    });
}


function apiStats() {
    console.log(response.headers['x-ratelimit-remaining']);
    console.log(response.headers['x-ratelimit-reset']);
}

module.exports = {
    getQuote
};