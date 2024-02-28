require('dotenv').config();
const finnhub = require('finnhub');
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const { Trader } = require('./trader.js');

const api_key = finnhub.ApiClient.instance.authentications['api_key'];
api_key.apiKey = process.env.API_KEY;

module.exports = new finnhub.DefaultApi();

const subscriptions = {};
const basic = new Trader('basic', './traders/basic/basic.js');
basic.start();

app.get('/add', (req, res) => {
    const { name } = req.query;

    try {
        subscriptions[name] = new Trader(name, `./traders/${name}/${name}.js`);
        const result = subscriptions[name].load();
        return res.status(200).json(result);
    } catch (err) {
        return res.sendStatus(500);
    }
});

app.get('/remove', (req, res) => {
    const { name } = req.query;

    delete subscriptions[name];
    res.sendStatus(200);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});