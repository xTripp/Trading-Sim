const { Journal } = require('./journal.js');

class Portfolio {
    constructor(name) {
        this.portfolio = [];
        this.journal = new Journal(name);
        this.balance = 10000.00;
    }

    buy(symbol, count, price) {
        const cost = (count * price).toFixed(2);
        if (parseFloat(cost) > this.balance) {
            return {type: 'info', val: `Insufficient funds. You are buying ${count} $${symbol} shares for $${cost}, but you only have $${this.balance}`};
        }

        this.balance = (this.balance - parseFloat(cost)).toFixed(2);

        const asset = {
            symbol: symbol,
            quantity: count,
            price: parseFloat(price.toFixed(2))
        }
        this.portfolio.push(asset);

        this.journal.recordTrade(symbol, 'buy', count, parseFloat(price.toFixed(2)), formatDate(new Date()));
        return {type: 'info', val: `$${symbol} buy @ ${parseFloat(price.toFixed(2))}. New balance: ${this.balance}`};
    }

    sell(symbol, count, price) {
        const total = this.portfolio.reduce((total, asset) => asset.symbol === symbol ? total + asset.quantity : total, 0);
        if (total < count) {
            return {type: 'info', val: `Insufficient shares. You are selling ${count} $${symbol} shares but you have ${total}`};
        }

        const profit = (count * price).toFixed(2);
        this.balance = (parseFloat(this.balance) + parseFloat(profit)).toFixed(2);

        let remainingCount = count;
        this.portfolio = this.portfolio.filter(asset => {
            if (asset.symbol === symbol && remainingCount !== 0) {
                if (asset.quantity > remainingCount) {
                    asset.quantity -= remainingCount;
                    remainingCount = 0;
                } else {
                    remainingCount -= asset.quantity;
                    return false;
                }
            }
            return true;
        });

        this.journal.recordTrade(symbol, 'sell', count, parseFloat(price.toFixed(2)), formatDate(new Date()));
        return {type: 'info', val: `$${symbol} sell @ ${parseFloat(price.toFixed(2))}. New balance: ${this.balance}`};
    }
}

function formatDate(date) {
    return date.toLocaleString('en-US', {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    }).replace(',', '');
}

module.exports = {
    Portfolio
};
