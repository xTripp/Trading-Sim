const { Portfolio } = require('../../portfolio.js');
const ex = require('../../exchange.js');

const basic = new Portfolio('basic');

function buyLowSellHigh() {
    let previousPrice = ex.getPrice('COIN');
    console.log(previousPrice);
}

buyLowSellHigh();