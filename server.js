// CODE FLOW:
//
// Internal API  --  *server.js  --  Exchange API Handle
//       \               |                    |
// *React Frontend     Trader             exchange.js
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

require('dotenv').config({path: '../.env'});
const finnhub = require('finnhub');
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const { Trader } = require('./trader.js').default;

const api_key = finnhub.ApiClient.instance.authentications['api_key'];
api_key.apiKey = process.env.API_KEY;

module.exports = new finnhub.DefaultApi();

const subscriptions = {};

//app.use(express.static(path.join(__dirname, 'infinite_mg/build')));
app.use(cors());

app.get('/add', (req, res) => {
    const { name } = req.query;

    try {
        subscriptions[name] = new Trader(name, `./traders/${name}/${name}.js`);
        subscriptions[name].start();
        return res.status(200).json(subscriptions[name]);
    } catch (err) {
        return res.sendStatus(500);
    }
});

app.get('/remove', (req, res) => {
    const { name } = req.query;

    delete subscriptions[name];
    res.sendStatus(200);
});

const PORT = process.env.PORT || 3555;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});