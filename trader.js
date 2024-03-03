const WebSocket = require('ws');

class Trader {
    constructor(path, port) {
        this.trader = require(path);
        this.port = port;
        this.wss = new WebSocket.Server({ port: port });
        this.wss.on('connection', this.handleConnection.bind(this)); // Ensure correct binding
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

    // net is calculating based on the price bought at, not the actual value of the stock. fix this when it becomes important
    getNet() {
        let net = Math.round(this.getBal() * 100);
        const portfolio = this.getPortfolio();
    
        for (const asset of portfolio) {
            net += Math.round(asset.quantity * (asset.price * 100));
        }
    
        return net / 100;
    }

    handleConnection(ws) {
        ws.on('message', (message) => { // Using arrow function for correct 'this' binding
            this.wss.clients.forEach((client) => { // Ensure 'this.wss' is defined
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    console.log(message);
                    client.send(JSON.stringify(message));
                }
            });
        });
    }
}

module.exports = {
    Trader
};
