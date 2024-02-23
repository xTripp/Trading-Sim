const { fs } = require('fs');

class Journal {
    constructor(name) {
        this.path = `./${name}.csv`;
    }

    recordTrade(symbol, type, count, price, time) {
        const data = `${symbol},${type},${count},${price},${time}\n`;

        fs.writeFile(this.path, data, 'utf-8', (err) => {
            if (err) {
                console.error(`Failed to record $${symbol} ${type}`);
            } else {
                console.log(`$${symbol} ${type} recorded successfully!`);
            }
        });
    }
}

module.exports = {
    Journal
};