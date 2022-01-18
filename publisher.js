require('dotenv').config();
const http = require('http');
const amqp = require('amqplib');

const weatherSecret = process.env.weatherSecret; //retrieve application secret

// publisher
setInterval(async() => {
    try {
        const connection = await amqp.connect("amqp://localhost:5672"); //establish connection to rabbitMQ
        const channel = await connection.createChannel();
        await channel.assertQueue("jobs"); //create a queue
        
        http.get(`http://api.weatherstack.com/current?access_key=${weatherSecret}&query=Nairobi`,(resp)=> { //establish http connection to weather api

            let data = '';

            resp.on('data', (chunk)=> {
                data += chunk;
            });

            resp.on('end', ()=> {
                channel.sendToQueue("jobs", Buffer.from(JSON.stringify(data))); //send to the jobs queue data received from api
            });

            resp.on('error', (err)=> {
                console.log("Error:" + err.message);
            });

        });

    }
    catch(err) {
        console.log(err); //log out error in event of an error.
    }

}, 600000); //run in 10mins intervals
