const fs = require('fs');

class Journal {
    constructor(name) {
        this.path = `./traders/${name}/${name}.csv`;
    }

    recordTrade(symbol, type, count, price, time) {
        const data = `${symbol},${type},${count},${price},${time}\n`;

        fs.appendFile(this.path, data, 'utf-8', (err) => {
            if (err) {
                console.error(`Failed to record $${symbol} ${type}`);
            }
        });
    }
}

module.exports = {
    Journal
};