const Promise = require('bluebird');
const logger = require('../logger');
const { reject, resolve } = require('bluebird');

class BaseConsumer {

    constructor({ Consumer, client, Offset, options }) {
        this.Consumer = Consumer;
        this.client = client;
        this.Offset = Offset;
        this.options = options || { autoCommit: false, fetchMaxWaitMs: 1000, fetchMaxBytes: 1024 * 1024 };
    }

    connect(topics = []) {
        this.consumerInst = new this.Consumer(this.client, topics, this.options);
        this.offset = new this.Offset(this.client);
        return new Promise((resolve, reject) => { // this doesn't return resolve for Basic Consumer
            this.consumerInst.on('ready', () => {
                logger.info("Consumer brokers are discovered.");
            });
            this.consumerInst.on('connect', () => {
                logger.info("Consumer brokers are ready.");
                return resolve(this.consumerInst);
            });
            this.consumerInst.on('error', (err) => {
                if (err) {
                    logger.error(err);
                    return reject(err);
                }
            });

            this.consumerInst.on('message', this._messageHandler.bind(this));
            /*
            * If consumer get `offsetOutOfRange` event, fetch data from the smallest(oldest) offset
            */
            this.consumerInst.on('offsetOutOfRange', (topic) => {
                topic.maxNum = 2;
                this.offset.fetch([topic], (err, offsets) => {
                    if (err) {
                        logger.error(err);
                        return reject(err);
                    }
                    var min = Math.min.apply(null, offsets[topic.topic][topic.partition]);
                    this.consumerInst.setOffset(topic.topic, topic.partition, min);
                  });
            });
        });
    }

    _messageHandler(message) {
        Promise.try(() => {
            return this.messageHandler(message);
        })
        .then(() => {
            return this.commitMessage(message);
        })
        .catch((err) => {
            logger.error(err);
        });
    }

    commitMessage(message) {
        this.consumerInst.setOffset (message.topic, message.partition, message.offset );
        return new Promise((resolve, reject) => {
            this.consumerInst.commit ((err, data) => {
                if (err) {
                    logger.error(err);
                    return reject(err);
                }
                logger.info("Commited", data);
                return resolve(data);
            });
        })

    }

    messageHandler(message) {
        logger.log("Got new message", message);
        return Promise.resolve();
    }

}

module.exports = BaseConsumer;
