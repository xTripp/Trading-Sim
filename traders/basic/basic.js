const { Portfolio } = require('../../portfolio.js');
const ex = require('../../exchange.js');

const basic = new Portfolio('basic');

function buyLowSellHigh() {
    let previousPrice = ex.getPrice('COIN', ['c'], (err, data) => {
        if (err) {
            return data.reduce((val, i) => {
                val[i] = 0.00;
                return val;
            }, {});
        } else {
            return data;
        }
    });
    console.log(previousPrice);
}

buyLowSellHigh();