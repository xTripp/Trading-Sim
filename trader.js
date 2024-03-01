class Trader {
    constructor(path, port) {
        this.trader = require(path);
        this.port = port;
        this.wss = new WebSocket.Server({ port: this.port });
    }

    start() {


        this.ws = this.trader.run();
        setInterval(() => {
            this.ws.send(JSON.stringify({
                bal: this.getBal(),
                portfolio: this.getPortfolio(),
                net: this.getNet()
            }));
        }, 1000);
    }

    stop() {
        this.trader.freeze();
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

export default {
    Trader
};