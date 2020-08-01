const logger = console;

class BaseProducer {

    constructor({ Producer, client }) {
        this.Producer = Producer;
        this.client = client;
        this._setInst();
    }

    _setInst() {
        this.producerInst = new this.Producer(this.client);
        return new Promise((resolve, reject) => {
            this.producerInst.on('ready', () => {
                logger.info("Producer is ready");
                return resolve(this.producerInst);
            });
            this.producerInst.on('error', (err) => {
                if (err) {
                    logger.error(err);
                    return reject(err);
                }
            });
        });
    }

    sendMessage(payloads) {
        return new Promise((resolve, reject) => {
            this.producerInst.send(payloads, function (err, data) {
                if (err) {
                    return reject(err);
                }
                return resolve(data);
            });
        });
    }
}

module.exports = BaseProducer;
