class Trader {
    constructor(name, path) {
        this.name = name;
        this.path = path;
        this.trader = require(this.path);
        this.status = 'waiting';
    }

    start() {
        this.trader.run();
    }

    stop() {
        this.trader.freeze();
    }

    load() {
        const data = {
            net: this.getNet(),
            bal: this.getBal(),
            portfolio: this.getPortfolio()
        };

        return data;
    }

    getBal() {
        return this.trader.portfolio.balance;
    }

    getPortfolio() {
        return this.trader.portfolio.portfolio;
    }

    getNet() {
        let net = this.getBal();
        const portfolio = this.getPortfolio();
    
        for (const asset of portfolio) {
            const assetValue = Math.round(asset.quantity * asset.price * 100);
            net = Math.round((net * 100 + assetValue) / 100);
        }
    
        return net / 100;
    }
}

module.exports = {
    Trader
};