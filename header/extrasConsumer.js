import { connect } from "amqplib";

/**
 * Receives extras updates from the queue.
 *
 * @param {import("amqplib").Channel} channel
 */
async function receiveExtrasUpdates(channel) {
  const exchangeName = "scoreboard-headers";
  const exchangeType = "headers";
  const headers = {
    "x-match": "any",
    "extra-type-player": "wide",
    "extra-type-team": "leg byes",
  };

  await channel.assertExchange(exchangeName, exchangeType, { durable: false });
  const queue = await channel.assertQueue("", { durable: false });
  await channel.bindQueue(queue.queue, exchangeName, "", headers);

  channel.consume(queue.queue, (message) => {
    console.log("Received extras updates ", JSON.parse(message.content));
    channel.ack(message);
  });
}

const connection = await connect("amqp://localhost");
const channel = await connection.createChannel();

receiveExtrasUpdates(channel);

setTimeout(() => {
  connection.close();
}, 15000);
