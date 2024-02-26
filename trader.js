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

    getBal() {
        return this.trader.portfolio.balance;
    }

    getPortfolio() {
        return this.trader.portfolio.portfolio;
    }
}

module.exports = {
    Trader
};