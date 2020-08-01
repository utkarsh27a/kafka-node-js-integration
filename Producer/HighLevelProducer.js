const kafka = require('kafka-node');
const BaseProducer = require('./BaseProducer');

class HighLevelProducer extends BaseProducer {

    constructor() {
        super({Producer: kafka.HighLevelProducer, client: new kafka.KafkaClient(), KeyedMessage: kafka.KeyedMessage });
    }

}

module.exports = HighLevelProducer;
