const WebSocket = require('ws');

class Trader {
    constructor(path, port) {
        this.trader = require(path);
        this.port = port;
        this.wss = new WebSocket.Server({ port: port });
        this.wss.on('connection', this.handleConnection.bind(this));
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
        console.log('External WebSocket connected');

        ws.on('message', (message) => {
            console.log(`Received message: ${message} from WebSocket`);
            // You can perform additional actions here if needed
        });

        ws.on('close', () => {
            console.log('External WebSocket disconnected');
            // You can perform additional actions here if needed
        });
    }
}

module.exports = {
    Trader
};
