const Promise = require('bluebird');
const logger = require('../logger');
class BaseProducer {

    constructor({ Producer, client, KeyedMessage }) {
        this.Producer = Producer;
        this.client = client;
        this.KeyedMessage = KeyedMessage;
    }

    connect() {
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

    createKeyedMessage(key, message) {
        return Promise.resolve(new this.KeyedMessage(key, message));
    }
}

module.exports = BaseProducer;
