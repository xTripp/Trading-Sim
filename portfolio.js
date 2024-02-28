const { Journal } = require('./journal.js');

class Portfolio {
    constructor(name) {
        this.portfolio = [];
        this.journal = new Journal(name);
        this.balance = 10_000.00;
    }

    buy(symbol, count, price) {
        const cost = Math.round(count * price * 100) / 100;  // Convert to cents and round for floating point arithmetic
        if (cost > this.balance) {
            console.log(`Insufficient funds. You are buying ${count} $${symbol} shares for $${cost}, but you only have $${this.balance}`);
            return;
        }
        this.balance = Math.round((this.balance * 100 - cost * 100) / 100);  // Convert to cents and round for floating point arithmetic
        

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
            console.log(`Insufficient shares. You are selling ${count} $${symbol} shares but you have ${total}`);
            return;
        }

        const profit = Math.round(count * price * 100) / 100;  // Convert to cents and round for floating point arithmetic
        this.balance = Math.round((this.balance * 100 + profit * 100) / 100);  // Convert to cents and round for floating point arithmetic
        
    
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