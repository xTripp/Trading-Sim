const { Portfolio } = require('../../portfolio.js');
const ex = require('../../exchange.js');

const basic = new Portfolio('basic');
let heartbeat;

function buyLowSellHigh() {
    ex.getQuote('COIN')
    .then(data => {
        console.log(data);
    });
}

function run(step = 1000) {
    heartbeat = setInterval(() => {
        buyLowSellHigh();
    }, step);
}

function freeze() {
    clearInterval(heartbeat);
}

module.exports = {
    run,
    freeze
};