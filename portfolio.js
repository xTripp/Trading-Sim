const { Journal } = require('./journal.js');

class Portfolio {
    constructor(name) {
        this.portfolio = [];
        this.journal = new Journal(name);
        this.balance = 10_000.00;
    }

    buy(symbol, count, price) {
        const cost = (count * price).toFixed(2);
        if (cost > this.balance) {
            console.log(`Insufficient funds. You are buying ${count} $${symbol} shares for $${cost}, but you only have $${this.balance}`);
            return;
        }
        this.balance -= parseFloat(cost);

        const asset = {
            symbol: symbol,
            quantity: count,
            price: price
        }
        this.portfolio.push(asset);

        this.journal.recordTrade(symbol, 'buy', count, price, formatDate(new Date()));
        console.log(`$${symbol} buy. New balance: ${this.balance}`);
    }

    sell(symbol, count, price) {
        const total = this.portfolio.reduce((total, asset) => asset.symbol === symbol ? total + asset.quantity : total, 0);
        if (total < count) {
            console.log(`Insufficient shares. You are selling ${count} $${symbol} shares but you only have ${total}`);
            return;
        }

        const profit = (count * price).toFixed(2);
        this.balance += parseFloat(profit);
    
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

        this.journal.recordTrade(symbol, 'sell', count, price, formatDate(new Date()));
        console.log(`$${symbol} sell. New balance: ${this.balance}`);
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