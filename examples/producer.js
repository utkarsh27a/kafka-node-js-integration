const BasicProducer = require('../Producer/BasicProducer');

let producer = new BasicProducer();

producer.connect()
.then(() => {
    console.log("Kafka Producer connnected");
    return producer.createKeyedMessage('key', 'message');
})
.then((km) => {

    let payloads = [
        { topic: 'topic1', messages: 'hi', partition: 0 },
        { topic: 'topic2', messages: ['hello', 'world', km ] }
    ];
    return producer.sendMessage(payloads)
})
.then((result) => {
    console.log(result);
}).catch((err) => {
    console.err(err);
});