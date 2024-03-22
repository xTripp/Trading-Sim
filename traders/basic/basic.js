const WebSocket = require('ws');
const { Portfolio } = require('../../portfolio.js');
const ex = require('../../exchange.js');

let ws;
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
                    ws.send(JSON.stringify(portfolio.buy(stock, 1, data.c)));
                } else if (data.c < prev[stock]) {
                    ws.send(JSON.stringify(portfolio.sell(stock, 1, data.c)));
                }
            }
            prev[stock] = data.c;
        });
}

// fix this so that it will return the last known current price of the stock.
function getCurrentPrice(stock) {
    return prev[stock];
}

let stockIndex = 0;
function run(port, step = 1000) {
    ws = new WebSocket(`ws://localhost:${port}`);

    ws.onopen = () => {
        ws.send('Trader WebSocket connection established');
    };

    ws.onmessage = (event) => {
        //console.log('from basic:', event.data);
    };

    ws.onclose = () => {
        ws.send('Trader WebSocket connection closed');
    };

    ws.onerror = (err) => {
        ws.send('Trader WebSocket encountered an error');
        console.error('WebSocket error:', err);
    };

    heartbeat = setInterval(() => {
        buyLowSellHigh(interest[stockIndex]);
        stockIndex = (stockIndex + 1) % interest.length;
    }, step);
}

function freeze() {
    clearInterval(heartbeat);
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.close();
    }
}

module.exports = {
    portfolio,
    run,
    freeze,
    getCurrentPrice
};