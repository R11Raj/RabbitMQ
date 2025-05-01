const amqp = require("amqplib");

const connection = await amqp.connect("amqp://localhost")
const channel = await connection.createChannel();

const exchange = ""