// CODE FLOW:
//
// Internal API  --  *server.js  --  Exchange API Handle
//       \               |                    |
// *React Frontend   Trader (WSS)         exchange.js
//                       |
//           ./traders/<name>/<name>.js
//              /        |        \
//        Portfolio   Exchange    WebSocket
//            /
//       Journal
//
// * = entry point

// Status:
// 200 - Success
// 500 - Internal Server Error

// Ports:
// 3000 - React App
// 3555 - Express Server
// 3556 - basic

require('dotenv').config({path: '../.env'});
const finnhub = require('finnhub');
const express = require('express');
const cors = require('cors');

const app = express();
const { Trader } = require('./trader.js');

const api_key = finnhub.ApiClient.instance.authentications['api_key'];
api_key.apiKey = process.env.API_KEY;

module.exports = new finnhub.DefaultApi();

const subscriptions = {};

//app.use(express.static(path.join(__dirname, 'infinite_mg/build')));
app.use(cors());

app.get('/add', (req, res) => {
    const { name } = req.query;

    try {
        subscriptions[name] = new Trader(`./traders/${name}/${name}.js`, 3556);
        subscriptions[name].start();
        return res.status(200).json(subscriptions[name]);
    } catch (err) {
        return res.sendStatus(500);
    }
});

app.get('/remove', (req, res) => {
    const { name } = req.query;

    // need to handle deleting wss and all ws
    delete subscriptions[name];
    res.sendStatus(200);
});

const PORT = process.env.PORT || 3555;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});