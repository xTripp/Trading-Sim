class Trader {
    constructor(name, path) {
        this.name = name;
        this.path = path;
        this.pulse = require(this.path);
        this.status = 'waiting';
    }

    start() {
        this.pulse.run();
    }

    stop() {
        this.pulse.freeze();
    }
}

module.exports = {
    Trader
};