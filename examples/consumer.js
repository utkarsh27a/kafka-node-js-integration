const BasicConsumer = require('../Consumer/BasicConsumer');

// var client = new Client({ kafkaHost: 'localhost:9092' });
let topic1 = 'topic1'
let topic2 = 'topic2'
var topics = [{ topic: topic1, partition: 0 }, { topic: topic2, partition: 0 }];



let consumer = new BasicConsumer({});

consumer.connect(topics)
.then(() => {
    console.log("Kafka Consumer connnected.");
    return consumer.createKeyedMessage('key', 'message');
})
.catch((err) => {
    console.err(err);
});