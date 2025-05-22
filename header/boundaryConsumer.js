import { connect } from "amqplib";

/**
 * Receives boundary updates from the queue.
 *
 * @param {import("amqplib").Channel} channel
 */
async function receiveBoundaryUpdates(channel) {
  const exchangeName = "scoreboard-headers";
  const exchangeType = "headers";
  const headers = {
    "x-match": "all",
    "score-type": "runs",
    "runs-type": "boundary",
  };

  await channel.assertExchange(exchangeName, exchangeType, { durable: false });
  const queue = await channel.assertQueue("", { durable: false });
  await channel.bindQueue(queue.queue, exchangeName, "", headers);

  channel.consume(queue.queue, (message) => {
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
