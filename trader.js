class Trader {
    constructor(name, path) {
        this.name = name;
        this.path = path;
        this.trader = require(this.path);
        this.status = 'waiting';
    }

    start() {
        this.trader.run();
        setInterval(() => {
            console.log(this.getNet());
        }, 10000);
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
        let net = Math.round(this.getBal() * 100);
        const portfolio = this.getPortfolio();
    
        for (const asset of portfolio) {
            net += Math.round(asset.quantity * (asset.price * 100));
        }
    
        return net / 100;
    }
}

module.exports = {
    Trader
};