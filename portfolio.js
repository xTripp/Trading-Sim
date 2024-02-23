const { Journal } = require('./journal.js');

class Portfolio {
    constructor(name) {
        this.portfolio = [];
        this.journal = new Journal(name);
        this.balance = 10_000.00;
    }

    buy(symbol, count, price) {
        const cost = count * price;
        this.balance -= cost;

        const asset = {
            symbol: symbol,
            quantity: count,
            price: price
        }
        this.portfolio.push(asset);

        this.journal.recordTrade(symbol, 'buy', count, price, new Date());
    }

    sell(symbol, count, price) {
        const profit = count * price;
        this.balance += profit;
    
        let remainingCount = count;
        this.portfolio = this.portfolio.filter(asset => {
            if (asset.symbol === symbol) {
                if (asset.quantity >= remainingCount) {
                    asset.quantity -= remainingCount;
                    remainingCount = 0;
                } else {
                    remainingCount -= asset.quantity;
                    return false;
                }
            }
            return true;
        });

        this.journal.recordTrade(symbol, 'sell', count, price, new Date());
    }
}

module.exports = {
    Portfolio
};