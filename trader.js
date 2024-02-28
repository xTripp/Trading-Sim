class Trader {
    constructor(name, path) {
        this.name = name;
        this.path = path;
        this.trader = require(this.path);
    }

    start() {
        this.trader.run();
    }

    stop() {
        this.trader.freeze();
    }

    load() {
        const data = {
            ws: this.getWs(),
            bal: this.getBal(),
            portfolio: this.getPortfolio(),
            net: this.getNet()
        };

        return data;
    }

    sendMessage(msg) {
        this.trader.ws.send(msg);
    }

    getBal() {
        return this.trader.portfolio.balance;
    }

    getPortfolio() {
        return this.trader.portfolio.portfolio;
    }

    // net is calculating based on the price bought at, not the actual value of the stock. fix this when it becomes important
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