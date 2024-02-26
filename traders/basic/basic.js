const { Portfolio } = require('../../portfolio.js');
const ex = require('../../exchange.js');

const name = 'basic';
const portfolio = new Portfolio(name);
const interest = ['COIN', 'TSLA', 'NVDA', 'AMD', 'AAPL'];
let heartbeat;

let prev = {};
function buyLowSellHigh(stock) {
    ex.getQuote(stock)
        .then(data => {
            if (prev[stock] !== undefined) {
                if (data.c > prev[stock]) {
                    portfolio.buy(stock, 1, data.c);
                } else if (data.c < prev[stock]) {
                    portfolio.sell(stock, 1, data.c);
                }
            }
            prev[stock] = data.c;
        });
    }

let stockIndex = 0;
function run(step = 1000) {
    heartbeat = setInterval(() => {
        buyLowSellHigh(interest[stockIndex]);
        stockIndex = (stockIndex + 1) % interest.length;
    }, step);
}

function freeze() {
    clearInterval(heartbeat);
}

module.exports = {
    portfolio,
    run,
    freeze
};