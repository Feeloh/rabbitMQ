const amqp = require('amqplib');

// consumer
(async() => {
    try {
        const connection = await amqp.connect("amqp://localhost:5672");
        const channel = await connection.createChannel();
        const result = await channel.assertQueue("jobs"); //connect to queue

        channel.consume("jobs", message=> {
            console.log(JSON.parse(message.content.toString())); //output as JSON object
        })
        
    }
    catch(err) {
        console.log(err);
    }

})();
