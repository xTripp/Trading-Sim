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
const fs = require('fs');
const path = require('path');

const app = express();
const { Trader } = require('./trader.js');

// move all exchange auth into exchange.js
const api_key = finnhub.ApiClient.instance.authentications['api_key'];
api_key.apiKey = process.env.API_KEY;
module.exports = new finnhub.DefaultApi();

// This code relies on all folders in the 'traders' directory to be named the same as its trading bot .js file
// If files or folders that are not in the correct format are located in the 'traders' directory this will error out
let router = {};
let port = 3556
fs.readdir('../traders', (err, traderDirs) => {
    if (err) {
        console.error('Failed to read \'traders\' directory: ', err);
        return;
    }

    traderDirs.forEach(traderName => {
        const traderPath = path.join(__dirname, 'traders', traderName, `${traderName}.js`);

        if (fs.existsSync(traderPath)) {
            router[traderName] = new Trader(traderPath, port);
            router[traderName].start(port++);
        } else {
            console.error(`Trader path '${traderPath}' does not exist`);
        }
    });
});

//app.use(express.static(path.join(__dirname, 'infinite_mg/build')));  i think i need this for when building a version of the app
app.use(cors());  // for security warning

app.get('/add', (req, res) => {
    const { name } = req.query;

    try {
        const responseData = {
            port: router[name].port
        };
        return res.status(200).json(responseData);
    } catch (err) {
        console.log(err)
        return res.sendStatus(500);
    }
});

app.get('/remove', (req, res) => {
    const { name } = req.query;

    // need to handle deleting wss and all ws
    delete subscriptions[name];
    res.sendStatus(200);
});

app.listen(3555, () => {
    console.log(`Server is running on port 3555`);
});