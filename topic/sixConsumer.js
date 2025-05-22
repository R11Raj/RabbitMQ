import { connect } from "amqplib";

/**
 * Receives six updates from the queue.
 *
 * @param {import("amqplib").Channel} channel
 */
async function receiveSixUpdates(channel) {
  const exchangeName = "scoreboard-topic";
  const exchangeType = "topic";
  const queueName = "six_updates_queue";
  const routingKey = "score.six";

  await channel.assertExchange(exchangeName, exchangeType, { durable: false });
  await channel.assertQueue(queueName, { durable: false });
  await channel.bindQueue(queueName, exchangeName, routingKey);

  channel.consume(queueName, (message) => {
    console.log("Received six updates ", JSON.parse(message.content));
    channel.ack(message);
  });
}

const connection = await connect("amqp://localhost");
const channel = await connection.createChannel();

receiveSixUpdates(channel);

setTimeout(() => {
  connection.close();
}, 15000);
