const Promise = require('bluebird');
const kafka = require('kafka-node');
const logger = require('../logger');
const BaseConsumer = require('./BaseConsumer');

class BasicConsumer extends BaseConsumer {

    constructor({ options }) {
        super({Consumer: kafka.Consumer, client: new kafka.KafkaClient(), Offset: kafka.Offset, options });
    }


}

module.exports = BasicConsumer;
