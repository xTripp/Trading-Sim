class Portfolio {
    constructor() {
        this.portfolio = [];
        this.balance = 10_000.00;
    }

    order(symbol, count, price) {
        const cost = count * price;
        const asset = {
            symbol: symbol,
            quantity: count,
            price: price
        }

        this.portfolio.push(asset);
        this.balance -= cost;
    }

    sell(symbol, count, price) {
        const profit = count * price;
        
    }
}
