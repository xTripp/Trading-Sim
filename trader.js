// Websocket Server Config
//
// - All messages require a type

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

    // enables the WSS to act as a message relay between the trader script and the frontend
    handleConnection(ws) {
        ws.on('message', (message) => {
            // if the message was a close command, close the server
            console.log(message);
            if (message.type === 'close') {
                console.log('close received by server: ', message);
                this.wss.close();
                return;
            }

            this.wss.clients.forEach((client) => {
                // send message to all open clients except the sender
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(message);
                }
            });
        });
    }
}

module.exports = {
    Trader
};
