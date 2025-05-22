import { connect } from "amqplib";

/**
 * Receives wicket updates from the queue.
 *
 * @param {import("amqplib").Channel} channel
 */
async function receiveWicketUpdates(channel) {
  const exchangeName = "scoreboard-topic";
  const exchangeType = "topic";
  const queueName = "wicket_updates_queue";
  const routingKey = "score.wicket";

  await channel.assertExchange(exchangeName, exchangeType, { durable: false });
  await channel.assertQueue(queueName, { durable: false });
  await channel.bindQueue(queueName, exchangeName, routingKey);

  channel.consume(queueName, (message) => {
    console.log("Received wicket updates ", JSON.parse(message.content));
    channel.ack(message);
  });
}

const connection = await connect("amqp://localhost");
const channel = await connection.createChannel();

receiveWicketUpdates(channel);

setTimeout(() => {
  connection.close();
}, 15000);
