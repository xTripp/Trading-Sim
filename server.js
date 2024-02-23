require('dotenv').config();
const finnhub = require('finnhub');
const { Trader } = require('./trader.js');

const api_key = finnhub.ApiClient.instance.authentications['api_key'];
api_key.apiKey = process.env.API_KEY;
module.exports = new finnhub.DefaultApi();

const basic = new Trader('basic', './traders/basic/basic.js');
basic.start();

