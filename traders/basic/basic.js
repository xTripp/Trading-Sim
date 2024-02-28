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
                    ws.send(portfolio.buy(stock, 1, data.c));
                } else if (data.c < prev[stock]) {
                    ws.send(portfolio.sell(stock, 1, data.c));
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

    ws = new WebSocket('ws://localhost:3556');

    ws.on('open', () => {
        console.log('WebSocket connection established');
    });

    ws.on('message', (data) => {
        if (data === 'init') {
            
        }
    });

    ws.on('close', () => {
        console.log('WebSocket connection closed');
    });

    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
}

function freeze() {
    clearInterval(heartbeat);
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.close();
    }
}

module.exports = {
    ws,
    portfolio,
    run,
    freeze
};