import { connect } from "amqplib";

/**
 * Receives boundary updates from the queue.
 *
 * @param {import("amqplib").Channel} channel
 */
async function receiveBoundaryUpdates(channel) {
  const exchangeName = "scoreboard-topic";
  const exchangeType = "topic";
  const queueName = "boundary_updates_queue";
  const routingKey = "score.boundary";

  await channel.assertExchange(exchangeName, exchangeType, { durable: false });
  await channel.assertQueue(queueName, { durable: false });
  await channel.bindQueue(queueName, exchangeName, routingKey);

  channel.consume(queueName, (message) => {
    console.log("Received boundary updates ", JSON.parse(message.content));
    channel.ack(message);
  });
}

const connection = await connect("amqp://localhost");
const channel = await connection.createChannel();

receiveBoundaryUpdates(channel);

setTimeout(() => {
  connection.close();
}, 15000);
