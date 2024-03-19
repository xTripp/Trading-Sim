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
        this.frontendClient = null;
        this.heartbeat = null;
    }

    start(port) {
        this.trader.run(port);

        // check if frontendClient is defined, wait 100ms if not and check again. If another heartbeat tries to start (page refreshes, etc.) but there is already one active it will do nothing.
        const waitForFrontendClient = () => {
            if (this.frontendClient && this.heartbeat == null) {
                this.heartbeat = setInterval(() => {
                    this.tellFrontend(JSON.stringify({type: 'portfolio', val: this.getPortfolio()}));
                    this.tellFrontend(JSON.stringify({type: 'net', val: this.getNet()}));
                }, 1000);
            } else if (this.heartbeat !== null){
                return;
            } else {
                setTimeout(waitForFrontendClient, 100);
            }
        };
        waitForFrontendClient();
    }

    stop() {
        this.trader.freeze();
        clearInterval(this.heartbeat);
    }

    getBal() {
        return this.trader.portfolio.balance;
    }

    getPortfolio() {
        return this.trader.portfolio.portfolio;
    }

    getNet() {
        let net = Math.round(this.getBal() * 100); // Convert balance to cents
        const portfolio = this.getPortfolio();
    
        for (const asset of portfolio) {
            net += Math.round(asset.quantity * (this.trader.getCurrentPrice(asset.symbol) * 100)); // Convert price to cents
        }
    
        return (net / 100).toFixed(2);
    }
    

    // enables the WSS to act as a message relay between the trader script and the frontend
    // also handles specific server functions like frontend identificantion
    handleConnection(ws) {
        ws.on('message', (message) => {
            let messageData;
            try {
                messageData = JSON.parse(message);
            } catch {
                messageData = null;
            }
            
            if (messageData?.type === 'identify' && messageData?.name === 'frontend') {
                this.frontendClient = ws;
                return;
            }
            
            // if nothing above triggered, broadcast the unfiltered message to all clients except the sender
            this.wss.clients.forEach((client) => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(message);
                }
            });
        });
    }

    // broadcast message to frontend
    tellFrontend(message) {
        if (this.frontendClient && this.frontendClient.readyState === WebSocket.OPEN) {
            this.frontendClient.send(message);
        }
    }
}

module.exports = {
    Trader
};
