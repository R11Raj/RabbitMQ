import { connect } from "amqplib";

/**
 * Receives score updates from the queue.
 *
 * @param {import("amqplib").Channel} channel
 */
async function receiveUpdates(channel) {
  const exchangeName = "scoreboard-fanout";
  const exchangeType = "fanout";

  await channel.assertExchange(exchangeName, exchangeType, { durable: false });
  const queue = await channel.assertQueue("", { exclusive: true });
  await channel.bindQueue(queue.queue, exchangeName, "");

  channel.consume(queue.queue, (message) => {
    console.log("TV score updates ", JSON.parse(message.content));
    channel.ack(message);
  });
}

const connection = await connect("amqp://localhost");
const channel = await connection.createChannel();

receiveUpdates(channel);

setTimeout(() => {
  connection.close();
}, 15000);
