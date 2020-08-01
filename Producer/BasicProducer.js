const kafka = require('kafka-node');
const BaseProducer = require('./BaseProducer');

class BasicProducer extends BaseProducer {

    constructor() {
        super({Producer: kafka.Producer, client: new kafka.KafkaClient() });
    }

}

module.exports = BasicProducer;
